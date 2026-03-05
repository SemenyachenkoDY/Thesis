# Apache Superset — Дашборд Fast Sign

## Подключение к PostgreSQL

1. Откройте Superset → **Settings** → **Database Connections** → **+ Database**
2. Выберите **PostgreSQL**
3. Введите параметры:
   - Host: `db` (в Docker) или `localhost` (локально)
   - Port: `5432`
   - Database: `fastsign`
   - Username: `postgres`
   - Password: (из .env)

## Рекомендуемые чарты

### 1. Success Rate (Big Number)
```sql
SELECT
  ROUND(100.0 * SUM(CASE WHEN status = 'SIGNED' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) AS success_rate
FROM documents;
```

### 2. Среднее время подписания (Big Number)
```sql
SELECT
  ROUND(AVG(processing_time_sec), 2) AS avg_seconds
FROM documents
WHERE processing_time_sec IS NOT NULL;
```

### 3. Документы по статусам (Pie Chart)
```sql
SELECT status, COUNT(*) AS count
FROM documents
GROUP BY status;
```

### 4. Документы по типам (Bar Chart)
```sql
SELECT doc_type, COUNT(*) AS count
FROM documents
GROUP BY doc_type
ORDER BY count DESC;
```

### 5. Динамика по месяцам (Line Chart)
```sql
SELECT
  TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') AS month,
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'SIGNED' THEN 1 ELSE 0 END) AS signed,
  SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) AS failed
FROM documents
GROUP BY month
ORDER BY month;
```

### 6. Попытки подписания (Histogram)
```sql
SELECT attempt_number, COUNT(*) AS count
FROM signatures
GROUP BY attempt_number
ORDER BY attempt_number;
```

### 7. Лента событий (Table)
```sql
SELECT event_type, entity_id, payload, created_at
FROM events
ORDER BY created_at DESC
LIMIT 100;
```

### 8. TO_BE vs AS_IS (Grouped Bar)
```sql
SELECT
  scenario,
  ROUND(AVG(processing_time_sec), 2) AS avg_time,
  COUNT(*) AS count,
  ROUND(100.0 * SUM(CASE WHEN status='SIGNED' THEN 1 ELSE 0 END) / NULLIF(COUNT(*),0), 2) AS success_rate
FROM documents
GROUP BY scenario;
```
