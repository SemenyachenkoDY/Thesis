-- Клиенты
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    phone VARCHAR(50),
    client_type VARCHAR(20) DEFAULT 'PHYSICAL',
    contract_number VARCHAR(50),
    has_kep BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Документы (основная таблица Fast Sign)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    group_id UUID,
    title VARCHAR(500) NOT NULL,
    doc_type VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'CREATED',
    scenario VARCHAR(10) DEFAULT 'TO_BE',
    department VARCHAR(100),
    sign_type VARCHAR(10),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    signed_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    processing_time_sec INTEGER,
    expires_at TIMESTAMPTZ
);

-- Подписи
CREATE TABLE IF NOT EXISTS signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    sign_type VARCHAR(10) NOT NULL,
    attempt_number INTEGER DEFAULT 1,
    status VARCHAR(30) DEFAULT 'PENDING',
    sms_code VARCHAR(6),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Отчёты
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    report_type VARCHAR(50) NOT NULL,
    title VARCHAR(500),
    period_start DATE,
    period_end DATE,
    status VARCHAR(30) DEFAULT 'FORMING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    formed_at TIMESTAMPTZ
);

-- Корпоративные действия
CREATE TABLE IF NOT EXISTS corp_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    action_type VARCHAR(20),
    isin VARCHAR(20),
    status VARCHAR(30) DEFAULT 'NEW',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Маржин-коллы
CREATE TABLE IF NOT EXISTS margin_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Налоговые записи
CREATE TABLE IF NOT EXISTS tax_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    tax_year INTEGER NOT NULL,
    tax_base NUMERIC(15,2) DEFAULT 0,
    to_pay NUMERIC(15,2) DEFAULT 0,
    paid NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- События (Event-Driven Architecture)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    entity_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_scenario ON documents(scenario);
CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_group ON documents(group_id);
CREATE INDEX IF NOT EXISTS idx_signatures_doc ON signatures(document_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_client ON reports(client_id);
CREATE INDEX IF NOT EXISTS idx_events_client ON events(client_id);
CREATE INDEX IF NOT EXISTS idx_events_entity ON events(entity_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_corp_actions_client ON corp_actions(client_id);
CREATE INDEX IF NOT EXISTS idx_corp_actions_type ON corp_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_margin_calls_client ON margin_calls(client_id);
CREATE INDEX IF NOT EXISTS idx_margin_calls_created ON margin_calls(created_at);

-- Обращения в поддержку 
CREATE TABLE IF NOT EXISTS support_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_support_requests_doc ON support_requests(document_id);
