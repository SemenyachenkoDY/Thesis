# ⚡️ Fast Sign — Микросервис быстрой подписи документов
![GitHub top language](https://img.shields.io/github/languages/top/YOUR_GITHUB_NAME/fast-sign)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=flat&logo=postgresql&logoColor=white)
![Apache Superset](https://img.shields.io/badge/apache%20superset-%23000000.svg?style=flat&logo=apache-superset&logoColor=white)
**Fast Sign** — это прототип микросервиса, разработанный в рамках выпускной квалификационной работы (ВКР) на тему _«Разработка прототипа микросервиса быстрой подписи документов для B2B-платформы и оценка его эффективности»_. 
Проект демонстрирует переход от устаревших ручных процессов (AS-IS) к автоматизированному, событийно-ориентированному сценарию (TO-BE), что многократно ускоряет подписание документов.
## 🎯 Цель проекта
Обеспечить отказоустойчивый и аналитически прозрачный процесс подписания документов в брокерской или иной B2B-платформе. Система минимизирует ручное вмешательство, собирает метрики (KPI) для визуализации и управляет всем жизненным циклом подписи.
## ✨ Ключевые возможности
- **Управление документами:** Создание, изменение статусов, расчет времени обработки.
- **Два типа подписи:** Поддержка логики работы с квалифицированной электронной подписью (КЭП) и простой (SMS-коды).
- **Событийная архитектура (EDA):** Регистрация и публикация событий (DocumentCreated, SignatureRequested, DocumentSigned и др.).
- **Интегрированная аналитика:** Настроенный дашборд в **Apache Superset** для отслеживания среднего времени подписания, Success Rate, количества ошибок и отказов.
- **Контейнеризация:** Удобное развертывание всей инфраструктуры (API, БД, Аналитика, Фронтенд) через Docker Compose.
## 🛠 Стек технологий
- **Backend API:** Node.js, Express
- **База данных:** PostgreSQL 16 (Event-sourcing таблицы, логирование статусов)
- **Business Intelligence (BI):** Apache Superset (для визуализации KPI)
- **Frontend-прототип:** Vanilla JS, HTML/CSS (размещается через Nginx или GitHub Pages)
- **Инфраструктура:** Docker, Docker Compose, GitHub Actions
## 📂 Структура проекта
\`\`\`text
fast-sign/
├── .github/workflows/   # CI/CD пайплайны GitHub Actions
├── DB/                  # Схемы PostgreSQL, скрипты миграций и сидирования
├── WebAPP/              # Исходный код Backend API и статический Frontend
├── docker-compose.yml   # Конфигурация для быстрого запуска всех сервисов
├── nginx.conf           # Конфигурация обратного прокси для фронтенда и API
└── DEPLOY.md            # Подробная инструкция по развертыванию
\`\`\`
## 🚀 Быстрый старт
Наиболее удобный способ запустить проект локально — использовать Docker. 
Полная инструкция доступна в [DEPLOY.md](./DEPLOY.md).
1. **Клонируйте репозиторий:**
   \`\`\`bash
   git clone https://github.com/ВАШ_ЛОГИН/fast-sign.git
   cd fast-sign
   \`\`\`
2. **Запустите контейнеры:**
   \`\`\`bash
   docker compose up -d --build
   \`\`\`
3. **Откройте запущенные сервисы в браузере:**
   - **Frontend (Пользовательский интерфейс):** [http://localhost:8080](http://localhost:8080)
   - **Backend API:** [http://localhost:3000](http://localhost:3000)
   - **Apache Superset (Аналитика):** [http://localhost:8088](http://localhost:8088)
## 📊 Аналитика и KPI (Superset)
В проекте реализована интеграция с Apache Superset для анализа эффективности прототипа. Основные отслеживаемые метрики:
1. **Успешность подписания (Success Rate)** (сравнение AS-IS и TO-BE).
2. **Среднее время обработки документа** (в минутах).
3. Динамика документов по датам и отделам.
4. Доля отказов и ошибок при подписании.
---
*Прототип разработан исключительно в исследовательских и демонстрационных целях.*
