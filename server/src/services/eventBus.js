const pool = require('../db');

/**
 * Публикация события в таблицу events (Event-Driven Architecture)
 * Superset читает эту таблицу для аналитики
 */
async function publishEvent(entityId, eventType, payload) {
  try {
    await pool.query(
      'INSERT INTO events (entity_id, event_type, payload) VALUES ($1, $2, $3)',
      [entityId, eventType, JSON.stringify(payload)]
    );
    console.log(`[EventBus] ${eventType} for ${entityId}`);
  } catch (err) {
    console.error('[EventBus] Failed to publish event:', err.message);
  }
}

module.exports = { publishEvent };
