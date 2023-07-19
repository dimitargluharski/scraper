module.exports = {
  apps: [
    {
      name: "telegram-bot",
      script: "telegram.js",
      cron_restart: "0 */12 * * *", // Restart the script every 12 hours (adjust as needed)
    },
    {
      name: "livetv",
      script: "livetv.js",
      cron_restart: "0 */1 * * *", // Restart the script every 1 hour (adjust as needed)
    },
  ],
};
