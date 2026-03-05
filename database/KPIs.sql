-- ============================================================
-- Fast Sign / ИнвестПорт — KPI SQL Queries (Thesis Section 2.4)
-- ============================================================

-- 1. Среднее время обработки по сценарию (AS-IS vs TO-BE)
-- Ожидаемый результат: Проверка сокращения времени в 10 раз.
SELECT 
    scenario,
    ROUND(AVG(processing_time_sec), 2) AS avg_processing_sec,
    ROUND(AVG(processing_time_sec) / 60, 2) AS avg_processing_min
FROM documents
WHERE processing_time_sec IS NOT NULL
GROUP BY scenario;

-- 2. Коэффициент успешности подписания (доля подписанных с первой попытки)
-- Учитывает только успешные подписи в зависимости от сценария.
SELECT 
    d.scenario,
    ROUND(100.0 * SUM(CASE WHEN s.attempt_number = 1 AND s.status = 'SUCCESS' THEN 1 ELSE 0 END) / NULLIF(COUNT(d.id), 0), 2) AS success_rate_pct
FROM documents d
LEFT JOIN signatures s ON d.id = s.document_id
GROUP BY d.scenario;

-- 3. Среднее количество попыток подписания на один документ
-- Чем меньше попыток, тем лучше пользовательский опыт.
SELECT 
    d.scenario, 
    ROUND(AVG(s.attempts_count), 2) AS avg_attempts
FROM documents d
LEFT JOIN (
    SELECT document_id, COUNT(*) as attempts_count 
    FROM signatures 
    GROUP BY document_id
) s ON d.id = s.document_id
GROUP BY d.scenario;

-- 4. Количество обращений в службу поддержки по сценарию
-- Показывает снижение операционной нагрузки в сценарии TO-BE.
SELECT 
    d.scenario, 
    COUNT(sr.id) AS support_tickets_count
FROM documents d
LEFT JOIN support_requests sr ON d.id = sr.document_id
GROUP BY d.scenario;

-- 5. Распределение типов документов (для общего мониторинга)
SELECT 
    doc_type, 
    COUNT(*) as count,
    ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM documents), 2) as percentage
FROM documents
GROUP BY doc_type
ORDER BY count DESC;
