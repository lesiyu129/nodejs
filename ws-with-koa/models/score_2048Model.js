const db = require('../db');
module.exports = db.defineModel('score_2048', {
    userId: db.STRING(),
    score: db.STRING()
});