import dbconfig from './dbconfig';
export default () => ({
  discord: {
    botToken: process.env.DISCORD_BOT_TOKEN,
    logChannel: process.env.DISCORD_LOG_CHANNEL,
    bugChannel: process.env.DISCORD_BUG_CHANNEL,
    warnChannel: process.env.DISCORD_WARN_CHANNEL,
  },
  database: dbconfig,
  proxyRedis: {
    host: process.env.PROXY_REDIS_HOST,
    port: process.env.PROXY_REDIS_PORT,
  },
  alert: {
    translatorUrl: process.env.ALERT_TRANSLATOR_URL || 'https://api.aibitranslator.com/api/v1/translator/text',
    translatorHeaders: {
      'x-rapidapi-proxy-secret': process.env.ALERT_X_RAPIDAPI_PROXY_SECRET || '5cf048c0-13ba-11ee-a37b-d799f0284f13',
      'authentication_aibit': process.env.ALERT_AUTHENTICATION_AIBIT || 'ivyA&7yL2-8',
      'Content-Type': 'application/json',
    },
    emailApiUrl: process.env.ALERT_EMAIL_API_URL || 'https://email.aibitranslator.com/api/mail/send',
    alertEmail: process.env.ALERT_EMAIL || 'besideyou123456@gmail.com',
    checkIntervalMs: parseInt(process.env.ALERT_CHECK_INTERVAL_MS || '300000', 10), // 5 minutes default
    cooldownMs: parseInt(process.env.ALERT_COOLDOWN_MS || '600000', 10), // 10 minutes default
  },
});
