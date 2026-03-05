/**
 * Мок SMS-провайдер (для прототипа)
 * В продакшене заменить на настоящий провайдер (Twilio, SMS.ru и т.д.)
 */
function sendSms(phone, message) {
  console.log(`[SMS] → ${phone}: ${message}`);
  return { success: true, provider: 'mock' };
}

module.exports = { sendSms };
