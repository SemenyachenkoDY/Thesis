import os
import sys
import uuid
import random
import argparse
from datetime import datetime, timedelta
from typing import Optional

try:
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError:
    print("psycopg2 не найден. Установите: pip install psycopg2-binary")
    sys.exit(1)

try:
    from faker import Faker
except ImportError:
    print("Faker не найден. Установите: pip install faker")
    sys.exit(1)

fake = Faker('ru_RU')

# Конфигурация 
NUM_CLIENTS = 50
NUM_DOCUMENTS_AS_IS = 200   # Сценарий AS_IS (без Fast Sign)
NUM_DOCUMENTS_TO_BE = 300   # Сценарий TO_BE (с Fast Sign)
NUM_REPORTS = 80
NUM_CORP_ACTIONS = 40
NUM_MARGIN_CALLS = 100
NUM_TAX_RECORDS = 50

# Типы документов
DOC_TYPES = ['contract', 'application', 'agreement', 'notification', 'order', 'protocol', 'questionnaire', 'power_of_attorney']
DOC_TYPE_TITLES = {
    'contract': 'Договор {}',
    'application': 'Заявление на {}',
    'agreement': 'Соглашение о {}',
    'notification': 'Уведомление о {}',
    'order': 'Поручение на {}',
    'protocol': 'Протокол {}',
    'questionnaire': 'Анкета клиента {}',
    'power_of_attorney': 'Доверенность на {}',
}
DOC_SUBJECTS = [
    'открытие брокерского счёта', 'изменение условий обслуживания',
    'расторжение договора', 'подключение услуги маржинального кредитования',
    'сделку OTC', 'изменение анкетных данных',
    'выдачу выписки со счёта', 'конфликт интересов',
    'присвоение статуса КИ', 'выпуск КЭП',
    'подключение аналитического портала', 'смену тарифного плана',
    'продление договора', 'блокировку счёта',
]

DEPARTMENTS = ['ДБО', 'ДКП', 'ДОК', 'ДРК', 'ДБУ', 'ДИТ', 'ДКО']

REPORT_TYPES = ['broker', 'depo', 'trade-day', 'deals', 'registry']
REPORT_TITLES = {
    'broker': 'Отчёт брокера {start}–{end}',
    'depo': 'Отчёт депозитария {start}–{end}',
    'trade-day': 'Дневной отчёт за {start}',
    'deals': 'Реестр сделок за {start}',
    'registry': 'Реестр поручений за {start}',
}

CORP_ACTION_TYPES = ['INTR', 'CAPG', 'DVCA', 'BONU', 'RHTS', 'TEND', 'MRGR']
ISSUERS = [
    'ПАО "Газпром"', 'ПАО "Сбербанк"', 'ПАО "Лукойл"', 'ПАО "НоваТЭК"',
    'ПАО "Роснефть"', 'ООО "АвтоМое Опт"', 'ПАО "Сегежа Групп"',
    'ПАО "ВТБ"', 'ПАО "Яндекс"', 'ПАО "МТС"', 'ПАО "Магнит"',
    'ООО "Whoosh"', 'ПАО "Полюс"', 'ПАО "Северсталь"',
]

MARGIN_CALL_TITLES = [
    'Величина обеспечения опустилась ниже размера начальной маржи',
    'Недостаточно средств для гарантийного обеспечения',
    'Требуется пополнение счёта для поддержания позиций',
    'Превышен лимит маржинального кредитования',
]


def random_date(start_year=2025, end_year=2026):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 12, 31)
    delta = end - start
    return start + timedelta(seconds=random.randint(0, int(delta.total_seconds())))


def generate_clients():
    clients = []
    for _ in range(NUM_CLIENTS):
        clients.append({
            'id': str(uuid.uuid4()),
            'name': fake.name(),
            'client_type': random.choice(['PHYSICAL'] * 8 + ['LEGAL'] * 2),
            'has_kep': random.random() < 0.15,
            'created_at': random_date(2023, 2025),
        })
    return clients


def generate_documents(clients, scenario, count):
    docs = []
    statuses_as_is = ['CREATED'] * 10 + ['SIGNATURE_REQUESTED'] * 30 + ['SIGNED'] * 40 + ['FAILED'] * 15 + ['EXPIRED'] * 5
    statuses_to_be = ['CREATED'] * 5 + ['SIGNATURE_REQUESTED'] * 15 + ['SIGNED'] * 65 + ['FAILED'] * 10 + ['EXPIRED'] * 5

    for _ in range(count):
        doc_type = random.choice(DOC_TYPES)
        subject = random.choice(DOC_SUBJECTS)
        title_template = DOC_TYPE_TITLES.get(doc_type, '{}')
        title = title_template.format(subject)

        status = random.choice(statuses_to_be if scenario == 'TO_BE' else statuses_as_is)
        created_at = random_date()
        sign_type = 'SMS' if scenario == 'TO_BE' else random.choice(['SMS', 'KEP'])

        # Время обработки: AS_IS = 30-600 мин, TO_BE = 0.5-10 мин
        processing_time = None
        completed_at = None
        attempts = 0

        if status in ('SIGNED', 'FAILED'):
            if scenario == 'TO_BE':
                processing_time = random.randint(30, 600)  # 30 сек — 10 мин
            else:
                processing_time = random.randint(1800, 36000)  # 30 мин — 10 часов
            completed_at = created_at + timedelta(seconds=processing_time)
            attempts = random.randint(1, 3) if status == 'FAILED' else random.randint(1, 2)

        if status == 'SIGNATURE_REQUESTED':
            attempts = random.randint(0, 2)

        docs.append({
            'id': str(uuid.uuid4()),
            'client_id': random.choice(clients)['id'],
            'title': title,
            'doc_type': doc_type,
            'status': status,
            'scenario': scenario,
            'department': random.choice(DEPARTMENTS),
            'sign_type': sign_type,
            'attempts': attempts,
            'created_at': created_at,
            'completed_at': completed_at,
            'processing_time_sec': processing_time,
        })
    return docs


def generate_signatures(documents):
    signatures = []
    for doc in documents:
        if doc['status'] in ('SIGNATURE_REQUESTED', 'SIGNED', 'FAILED'):
            num_attempts = max(doc['attempts'], 1)
            for attempt_num in range(1, num_attempts + 1):
                sig_status = 'COMPLETED' if (attempt_num == num_attempts and doc['status'] == 'SIGNED') else \
                             'FAILED' if (attempt_num == num_attempts and doc['status'] == 'FAILED') else 'PENDING'
                signatures.append({
                    'id': str(uuid.uuid4()),
                    'document_id': doc['id'],
                    'sign_type': doc['sign_type'] or 'SMS',
                    'sms_code': str(random.randint(1000, 9999)),
                    'attempt_number': attempt_num,
                    'status': sig_status,
                    'created_at': doc['created_at'] + timedelta(seconds=attempt_num * random.randint(10, 120)),
                    'completed_at': doc['completed_at'] if sig_status != 'PENDING' else None,
                })
    return signatures


def generate_events(documents, signatures, clients):
    events = []
    for doc in documents:
        events.append({
            'id': str(uuid.uuid4()),
            'client_id': doc['client_id'],
            'entity_id': doc['id'],
            'event_type': 'DocumentCreated',
            'payload': f'{{"doc_type":"{doc["doc_type"]}","scenario":"{doc["scenario"]}"}}',
            'created_at': doc['created_at'],
        })
        if doc['status'] in ('SIGNATURE_REQUESTED', 'SIGNED', 'FAILED'):
            events.append({
                'id': str(uuid.uuid4()),
                'client_id': doc['client_id'],
                'entity_id': doc['id'],
                'event_type': 'SignatureRequested',
                'payload': f'{{"sign_type":"{doc["sign_type"]}"}}',
                'created_at': doc['created_at'] + timedelta(seconds=5),
            })
        if doc['status'] == 'SIGNED':
            events.append({
                'id': str(uuid.uuid4()),
                'client_id': doc['client_id'],
                'entity_id': doc['id'],
                'event_type': 'DocumentSigned',
                'payload': f'{{"processing_time_sec":{doc["processing_time_sec"]},"attempts":{doc["attempts"]}}}',
                'created_at': doc['completed_at'],
            })
        if doc['status'] == 'FAILED':
            events.append({
                'id': str(uuid.uuid4()),
                'client_id': doc['client_id'],
                'entity_id': doc['id'],
                'event_type': 'SignatureFailed',
                'payload': f'{{"reason":"max_attempts","attempts":{doc["attempts"]}}}',
                'created_at': doc['completed_at'],
            })
    return events


def generate_reports(clients):
    reports = []
    for _ in range(NUM_REPORTS):
        rtype = random.choice(REPORT_TYPES)
        period_start = random_date().date()
        period_end = period_start + timedelta(days=random.randint(1, 30))
        template = REPORT_TITLES[rtype]
        title = template.format(start=period_start.strftime('%d.%m.%Y'), end=period_end.strftime('%d.%m.%Y'))
        status = random.choice(['FORMING'] * 10 + ['FORMED'] * 80 + ['EXPIRED'] * 10)
        created_at = random_date()
        reports.append({
            'id': str(uuid.uuid4()),
            'client_id': random.choice(clients)['id'],
            'report_type': rtype,
            'title': title,
            'period_start': period_start,
            'period_end': period_end,
            'status': status,
            'created_at': created_at,
            'formed_at': created_at + timedelta(minutes=random.randint(1, 60)) if status == 'FORMED' else None,
        })
    return reports


def generate_corp_actions(clients):
    actions = []
    for _ in range(NUM_CORP_ACTIONS):
        action_type = random.choice(CORP_ACTION_TYPES)
        issuer = random.choice(ISSUERS)
        isin = f'RU000A{random.randint(10000, 99999)}'
        title = f'({action_type}) О корпоративном действии с ценными бумагами эмитента {issuer} (ISIN {isin})'
        actions.append({
            'id': str(uuid.uuid4()),
            'client_id': random.choice(clients)['id'],
            'title': title,
            'action_type': action_type,
            'status': random.choice(['NEW'] * 70 + ['PROCESSED'] * 30),
            'created_at': random_date(),
        })
    return actions


def generate_margin_calls(clients):
    calls = []
    for _ in range(NUM_MARGIN_CALLS):
        calls.append({
            'id': str(uuid.uuid4()),
            'client_id': random.choice(clients)['id'],
            'title': random.choice(MARGIN_CALL_TITLES),
            'created_at': random_date(),
        })
    return calls


def generate_tax_records(clients):
    records = []
    for _ in range(NUM_TAX_RECORDS):
        tax_base = round(random.uniform(-5000, 50000), 2)
        to_pay = round(max(0, tax_base * 0.13), 2)
        paid = round(to_pay * random.uniform(0, 1), 2)
        records.append({
            'id': str(uuid.uuid4()),
            'client_id': random.choice(clients)['id'],
            'tax_year': random.choice([2024, 2025, 2026]),
            'tax_base': tax_base,
            'to_pay': to_pay,
            'paid': paid,
            'created_at': random_date(),
        })
    return records


def generate_support_requests(documents):
    requests = []
    for doc in documents:
        # Вероятность обращения: AS_IS (15%), TO_BE (3%)
        chance = 0.15 if doc['scenario'] == 'AS_IS' else 0.03
        if random.random() < chance:
            requests.append({
                'id': str(uuid.uuid4()),
                'document_id': doc['id'],
                'created_at': doc['created_at'] + timedelta(hours=random.randint(1, 48)),
                'resolved': random.random() < 0.8,
            })
    return requests


def insert_data(conn, table, columns, rows):
    """Batch insert using execute_values for performance"""
    if not rows:
        return
    template = f"({','.join(['%s'] * len(columns))})"
    sql = f"INSERT INTO {table} ({','.join(columns)}) VALUES %s ON CONFLICT DO NOTHING"
    values = [tuple(row[c] for c in columns) for row in rows]
    with conn.cursor() as cur:
        execute_values(cur, sql, values, template=template, page_size=500)
    conn.commit()
    print(f"  [OK] {table}: {len(rows)} записей")


def main():
    parser = argparse.ArgumentParser(description='Fast Sign — Генератор синтетических данных')
    parser.add_argument('--host', default=os.getenv('DB_HOST', 'localhost'))
    parser.add_argument('--port', type=int, default=int(os.getenv('DB_PORT', '5432')))
    parser.add_argument('--dbname', default=os.getenv('DB_NAME', 'fastsign'))
    parser.add_argument('--user', default=os.getenv('DB_USER', 'postgres'))
    parser.add_argument('--password', default=os.getenv('DB_PASSWORD', 'fastsign_pass'))
    parser.add_argument('--clean', action='store_true', help='Очистить таблицы перед загрузкой')
    args = parser.parse_args()

    print(f"\n{'='*50}")
    print(f"  Fast Sign — Генератор данных")
    print(f"{'='*50}\n")
    print(f"  Подключение: {args.user}@{args.host}:{args.port}/{args.dbname}")

    conn = psycopg2.connect(
        host=args.host, port=args.port,
        dbname=args.dbname, user=args.user, password=args.password
    )

    if args.clean:
        print("\n  Очистка таблиц...")
        with conn.cursor() as cur:
            for t in ['support_requests', 'events', 'signatures', 'margin_calls', 'corp_actions', 'tax_records', 'reports', 'documents', 'clients']:
                cur.execute(f"DELETE FROM {t}")
        conn.commit()
        print("  [OK] Очищено")

    print("\n  Генерация данных...")

    # 1. Clients
    clients = generate_clients()
    insert_data(conn, 'clients', ['id', 'name', 'client_type', 'has_kep', 'created_at'], clients)

    # 2. Documents (AS_IS + TO_BE)
    docs_as_is = generate_documents(clients, 'AS_IS', NUM_DOCUMENTS_AS_IS)
    docs_to_be = generate_documents(clients, 'TO_BE', NUM_DOCUMENTS_TO_BE)
    all_docs = docs_as_is + docs_to_be
    insert_data(conn, 'documents',
        ['id', 'client_id', 'title', 'doc_type', 'status', 'scenario', 'department', 'sign_type', 'attempts', 'created_at', 'completed_at', 'processing_time_sec'],
        all_docs)

    # 3. Signatures
    signatures = generate_signatures(all_docs)
    insert_data(conn, 'signatures',
        ['id', 'document_id', 'sign_type', 'sms_code', 'attempt_number', 'status', 'created_at', 'completed_at'],
        signatures)

    # 4. Events
    events = generate_events(all_docs, signatures, clients)
    insert_data(conn, 'events', ['id', 'client_id', 'entity_id', 'event_type', 'payload', 'created_at'], events)

    # 5. Reports
    reports = generate_reports(clients)
    insert_data(conn, 'reports',
        ['id', 'client_id', 'report_type', 'title', 'period_start', 'period_end', 'status', 'created_at', 'formed_at'],
        reports)

    # 6. Corp Actions
    corp_actions = generate_corp_actions(clients)
    insert_data(conn, 'corp_actions', ['id', 'client_id', 'title', 'action_type', 'status', 'created_at'], corp_actions)

    # 7. Margin Calls
    margin_calls = generate_margin_calls(clients)
    insert_data(conn, 'margin_calls', ['id', 'client_id', 'title', 'created_at'], margin_calls)

    # 8. Tax Records
    tax_records = generate_tax_records(clients)
    insert_data(conn, 'tax_records',
        ['id', 'client_id', 'tax_year', 'tax_base', 'to_pay', 'paid', 'created_at'],
        tax_records)

    # 9. Support Requests
    support_requests = generate_support_requests(all_docs)
    insert_data(conn, 'support_requests', ['id', 'document_id', 'created_at', 'resolved'], support_requests)

    # Итоги
    total = len(clients) + len(all_docs) + len(signatures) + len(events) + len(reports) + len(corp_actions) + len(margin_calls) + len(tax_records) + len(support_requests)
    print(f"\n{'='*50}")
    print(f"  Итого: {total} записей загружено!")
    print(f"  AS_IS документов: {len(docs_as_is)}")
    print(f"  TO_BE документов: {len(docs_to_be)}")
    print(f"  Событий: {len(events)}")
    print(f"{'='*50}\n")

    conn.close()


if __name__ == '__main__':
    main()
