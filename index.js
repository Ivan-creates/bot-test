const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require("./options");

const token = '5190629227:AAHtfImgkxvBV7s_BCWztb9_gxyCAZYGbfU'

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а ты должен угадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начало работы'},
        {command: '/info', description: 'Информация о пользователе'},
        {command: '/game', description: 'Мини игра'},
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/9.webp')
            return bot.sendMessage(chatId, `Добро пожаловать`)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, поробуй ещё раз!')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравлямба, ты отгадал цифру ${chats[chatId]}`, againOptions)
        }
        else {
            return bot.sendMessage(chatId, `Ты не угадал цифру, бот загадал ${chats[chatId]}`, againOptions)
        }
    })
}

start()
