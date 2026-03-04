# Fast Sign — Инструкция по развёртыванию

## Содержание

1. [Локальный запуск](#1-локальный-запуск)
2. [Docker (рекомендуется)](#2-docker-рекомендуется)
3. [PostgreSQL — настройка базы данных](#3-postgresql--настройка-базы-данных)
4. [Apache Superset — аналитика](#4-apache-superset--аналитика)
5. [GitHub Pages — публикация фронтенда](#5-github-pages--публикация-фронтенда)
6. [GitHub Actions — CI/CD](#6-github-actions--cicd)

---

## 1. Локальный запуск

### Предварительные требования

- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm ≥ 9

### Шаги

```bash
# 1. Клонировать репозиторий
git clone https://github.com/<ваш-логин>/fast-sign.git
cd fast-sign/WebAPP

# 2. Установить зависимости
npm install

# 3. Настроить переменные окружения
# Скопировать пример и заполнить данные БД:
cp .env.example .env

# 4. Создать таблицы в PostgreSQL
psql -U postgres -d fast_sign -f DB/schema.sql

# 5. Заполнить тестовыми данными
python DB/seed_data.py

# 6. Запустить сервер
node server.js
# Сервер запустится на http://localhost:3000

# 7. Открыть фронтенд
# Откройте index.html в браузере, или:
npx -y http-server . -p 8080
# Фронтенд доступен на http://localhost:8080
```

---

## 2. Docker (рекомендуется)

### docker-compose.yml

Создайте файл `docker-compose.yml` в корне проекта:

```yaml
version: "3.9"

services:
  # ── PostgreSQL ──
  db:
    image: postgres:16-alpine
    container_name: fastsign-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: fast_sign
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./DB/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 5

  # ── Backend (Node.js / Express) ──
  api:
    build:
      context: ./WebAPP
      dockerfile: Dockerfile
    container_name: fastsign-api
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: postgres
      DB_PASSWORD: postgres
      DB_NAME: fast_sign
    depends_on:
      db:
        condition: service_healthy

  # ── Frontend (nginx) ──
  web:
    image: nginx:alpine
    container_name: fastsign-web
    restart: unless-stopped
    ports:
      - "8080:80"
    volumes:
      - ./WebAPP/index.html:/usr/share/nginx/html/index.html:ro
      - ./WebAPP/styles.css:/usr/share/nginx/html/styles.css:ro
      - ./WebAPP/app.js:/usr/share/nginx/html/app.js:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - api

  # ── Apache Superset ──
  superset:
    image: apache/superset:latest
    container_name: fastsign-superset
    restart: unless-stopped
    ports:
      - "8088:8088"
    environment:
      SUPERSET_SECRET_KEY: supersecretkey123
      ADMIN_USERNAME: admin
      ADMIN_PASSWORD: admin
      ADMIN_EMAIL: admin@fastsign.local
    depends_on:
      db:
        condition: service_healthy

volumes:
  pgdata:
```

### Dockerfile для backend

Создайте `WebAPP/Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY server.js .
COPY DB/ ./DB/
EXPOSE 3000
CMD ["node", "server.js"]
```

### nginx.conf

Создайте `nginx.conf` в корне проекта:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://api:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Запуск

```bash
# Собрать и запустить все контейнеры
docker compose up -d --build

# Проверить статус
docker compose ps

# Посмотреть логи
docker compose logs -f api

# Остановить
docker compose down
```

После запуска:
- **Фронтенд**: http://localhost:8080
- **API**: http://localhost:3000
- **Superset**: http://localhost:8088

---

## 3. PostgreSQL — настройка базы данных

### Схема БД (`DB/schema.sql`)

```sql
-- Создание базы данных
CREATE DATABASE fast_sign;

-- Подключение к БД
\c fast_sign;

-- Таблица клиентов
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    inn VARCHAR(12),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Таблица документов
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    title VARCHAR(500) NOT NULL,
    doc_type VARCHAR(50) NOT NULL,  -- contract, application, agreement
    status VARCHAR(30) NOT NULL DEFAULT 'CREATED',
    scenario VARCHAR(10) DEFAULT 'TO_BE',  -- AS_IS или TO_BE
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    signing_time_seconds INTEGER
);

-- Таблица подписей
CREATE TABLE IF NOT EXISTS signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id),
    sign_type VARCHAR(10) NOT NULL,  -- KEP или SMS
    attempts INTEGER DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Таблица событий (Event-Driven)
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id),
    event_type VARCHAR(50) NOT NULL,
    payload JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created ON documents(created_at);
CREATE INDEX idx_documents_department ON documents(department);
CREATE INDEX idx_documents_doc_type ON documents(doc_type);
CREATE INDEX idx_events_document ON events(document_id);
CREATE INDEX idx_events_type ON events(event_type);
```

### Подключение из server.js

Обновите `DB/db.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'fast_sign',
  max: 20,
  idleTimeoutMillis: 30000,
});

module.exports = pool;
```

---

## 4. Apache Superset — аналитика

### Первичная настройка

```bash
# 1. Войти в контейнер Superset
docker exec -it fastsign-superset bash

# 2. Инициализировать БД Superset
superset db upgrade

# 3. Создать администратора
superset fab create-admin \
  --username admin \
  --firstname Admin \
  --lastname FastSign \
  --email admin@fastsign.local \
  --password admin

# 4. Инициализировать роли
superset init

# 5. Выйти из контейнера
exit
```

### Подключение PostgreSQL к Superset

1. Откройте http://localhost:8088
2. Войдите: `admin` / `admin`
3. Перейдите в **Settings → Database Connections → + Database**
4. Выберите **PostgreSQL**
5. Укажите параметры подключения:
   ```
   Host: db
   Port: 5432
   Database: fast_sign
   Username: postgres
   Password: postgres
   ```
6. Нажмите **Test Connection** → **Connect**

### Рекомендуемые дашборды Superset

| Дашборд | Запрос | Визуализация |
|---------|--------|--------------|
| Успешность подписания | `SELECT scenario, ROUND(100.0 * SUM(CASE WHEN status='COMPLETED' THEN 1 ELSE 0 END) / COUNT(*), 1) as rate FROM documents GROUP BY scenario` | Bar Chart |
| Динамика по месяцам | `SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') as month, COUNT(*) as total FROM documents GROUP BY month ORDER BY month` | Line Chart |
| Документы по отделам | `SELECT department, COUNT(*) as cnt FROM documents GROUP BY department ORDER BY cnt DESC` | Pie Chart |
| Среднее время | `SELECT scenario, ROUND(AVG(signing_time_seconds)/60.0, 1) as avg_min FROM documents WHERE completed_at IS NOT NULL GROUP BY scenario` | Big Number |

---

## 5. GitHub Pages — публикация фронтенда

GitHub Pages позволяет бесплатно опубликовать статический фронтенд.

### Шаги

```bash
# 1. Создать репозиторий на GitHub
# Перейдите на https://github.com/new

# 2. Инициализировать git (если не сделано)
cd fast-sign
git init
git add .
git commit -m "Initial commit: Fast Sign prototype"

# 3. Привязать и запушить
git remote add origin https://github.com/<ваш-логин>/fast-sign.git
git branch -M main
git push -u origin main
```

### Настройка GitHub Pages

1. Зайдите в **Settings → Pages** вашего репозитория
2. **Source**: Deploy from a branch
3. **Branch**: `main`, папка `/WebAPP`
4. Нажмите **Save**
5. Через 1–2 минуты сайт будет доступен по адресу:
   ```
   https://<ваш-логин>.github.io/fast-sign/
   ```

> **Важно**: фронтенд работает автономно с mock-данными.
> Для работы с реальной БД измените `app.js` — замените mock-данные на `fetch('/api/...')`.

---

## 6. GitHub Actions — CI/CD

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy Fast Sign

on:
  push:
    branches: [main]

jobs:
  deploy-pages:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: WebAPP
      - id: deployment
        uses: actions/deploy-pages@v4

  deploy-docker:
    runs-on: ubuntu-latest
    needs: deploy-pages
    steps:
      - uses: actions/checkout@v4
      - name: Build & Push Docker images
        run: |
          echo "Docker deploy step (настройте под ваш registry)"
          # docker compose build
          # docker compose push
```

---

## Структура файлов проекта

```
fast-sign/
├── docker-compose.yml
├── nginx.conf
├── .github/
│   └── workflows/
│       └── deploy.yml
├── DB/
│   ├── db.js
│   ├── schema.sql
│   └── seed_data.py
├── WebAPP/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── TASK.md
```
