const Bot = require('./src/Bot')
const config = require('./config/bot.config')
const messagesDB = require('./storage/messages-db')
const adminsDB = require('./storage/admins-db')

const locale = require('./locale/fa')

const unsentMessages = {}

class CriticsBot extends Bot {

    constructor (token) {
        super(token);
        for (let admin of adminsDB.data) this.addAdmin(admin.id)
    }

    onStart (msg) {
        this.sendMessage(msg.chat.id, locale.start)
    }

    onCommand (msg) {

        // get ID for making someone admin

        if (msg.text.toLowerCase() === '/getid') {
            return this.sendMessage(msg.chat.id, `Your TelegramChatID is ${msg.chat.id}`)
        }

        // admins can add admins

        if (msg.isAdmin && msg.text.startsWith('/admin')) {
            const id = parseInt(msg.text.split(' ')[1]);

            if (this.admins.includes(id)) this.sendMessage(msg.chat.id, locale.adminExist)

            this.addAdmin(id)

            this.sendMessage(id, locale.helloAdmin)
            adminsDB.data.push({
                id: id,
                recieve: true
            })
            return adminsDB.save();
        }

        if (msg.isAdmin && msg.text === '/toggle') {
            for (let admin of adminsDB.data) {
                if (admin.id === msg.chat.id) {
                    admin.recieve = !admin.recieve;
                    this.sendMessage(msg.chat.id, admin.recieve ? locale.enableRecieve : locale.disableRecieve)
                    break;
                }
            }
            return adminsDB.save();
        }

        if (msg.text === '/sendmessage') {

            const message = unsentMessages[msg.chat.id];

            // If there was no message, warn user

            if (!message) return this.sendMessage(msg.chat.id, locale.noMessageToSend);
            
            // sending message

            messagesDB.data.push({
                date: Date.now(),
                message: message
            });
            messagesDB.save();

            // sending a text message back!

            this.sendMessage(msg.chat.id, locale.thanks)

            // sending message to all admins

            for (let adminId of this.admins) {
                this.sendMessage(adminId, locale.recieve.replace('{MESSAGE}', message))
            }

        }

    }

    onMessage (msg) {
        
        // the only thing that saves is date and message

        unsentMessages[msg.chat.id] = msg.text;

        this.sendMessage(msg.chat.id, locale.areYouSure.replace('{MESSAGE}', msg.text))

    }

}

const criticsBot = new CriticsBot(config.token)