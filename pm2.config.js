module.exports = {
  apps: [
    {
      name: "telegram-bot",
      script: "telegram.js",
      cron_restart: "0 */3 * * *", // Restart the script every 3 hours (adjust as needed)
    },
    {
      name: "livetv",
      script: "livetv.js",
      cron_restart: "0 */3 * * *", // Restart the script every 3 hour (adjust as needed)
    },
  ],
};
