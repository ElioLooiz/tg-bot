const TelegramApi = require('node-telegram-bot-api')
const {
  gameOptions,
  againOptions
} = require('./options')

const token = '1742215923:AAEVrHXil6cQceKAT52tfHav16D9hI5DaqU'
const chats = {}

const bot = new TelegramApi(token, {
  polling: true
})


const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать`)

  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, `Отгадывай! ${chats[chatId]}`, gameOptions)
}

const start = () => {
  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id

    bot.setMyCommands([{
        command: '/start',
        description: 'Начальное приветствие'
      },
      {
        command: '/info',
        description: 'Получить информацию о пользователе'
      },
      {
        command: '/game',
        description: 'Сыграем в игру'
      }
    ])

    if (text === '/start') {
      await bot.sendMessage(chatId, `Welcome message!\nHello, dear ${msg.from.first_name}`)
      return bot.sendSticker(chatId, 'CAACAgIAAxkBAAMmYJXDDgtLFJmd9j_Z-fkTHMjNKUAAAn4AA5afjA5xgxGeLFy25R8E')
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
    }

    if (text === '/game') {
      return startGame(chatId)
    }

    bot.sendMessage(chatId, 'Я тебя не понимаю!')
    console.log(msg)
  })

  bot.on('callback_query', msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    console.log('TEST:', data, chats[chatId])


    if (data === '/again') {
      return startGame(chatId)
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты угадал цифру ${chats[chatId]}`, againOptions)
    } else {
      return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, againOptions)
    }
  })

}

start()