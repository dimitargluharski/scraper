const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_API_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const bot = new TelegramBot(token, { polling: true });

function sendTelegramMessage(message) {
  bot.sendMessage(chatId, message);
}

try {
  sendTelegramMessage("Page was successfully scraped!");
} catch (error) {
  sendTelegramMessage(`Error occurred: ${error.message}`);
}
