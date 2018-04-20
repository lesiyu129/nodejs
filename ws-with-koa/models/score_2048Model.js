const db = require('../db');
module.exports = db.defineModel('score_2048', {
    userId: {
        type: db.STRING(),
        references: {
            model: 'user',
            key: 'id'
        }
    },
    score: db.INTEGER()
});