const TelegramBot = require('node-telegram-bot-api');

class Bot {

    constructor (token) {
        this.admins = [];
        this.bot = new TelegramBot(token, {polling: true});
        this.bot.on('message', this._onMessage.bind(this));
    }

    // methods to overwrite

    onStart (msg) {}

    onStop (msg) {}

    onMessage (msg) {}

    onCommand (msg) {}

    // methods which call automatically

    _onMessage (msg) {

        // checking if message is sent by Admin

        msg.isAdmin = this.admins.includes(msg.chat.id)

        // checking message and passing it to other overwriting methods

        if (msg.text.startsWith('/start')) return this.onStart(msg);
        if (msg.text.startsWith('/stop')) return this.onStop(msg);
        if (msg.text.startsWith('/')) return this.onCommand(msg);
        return this.onMessage(msg)

    }

    // methods to call

    sendMessage (chatId, message) {
        this.bot.sendMessage(chatId, message)
    }

    addAdmin (chatId) {
        if (!this.admins.includes(chatId)) this.admins.push(chatId)
    }

}

module.exports = Bot;