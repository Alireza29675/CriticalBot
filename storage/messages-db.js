const Handy = require('handy-storage');

const db = new Handy('./storage/messages.json');

module.exports = db;