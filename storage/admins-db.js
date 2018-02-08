const Handy = require('handy-storage');

const db = new Handy('./storage/admins.json');

module.exports = db;