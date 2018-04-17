const db = require('../db');
module.exports = db.defineModel('user', {
    avatarUrl: db.STRING(),
    city: db.STRING(),
    country: db.STRING(),
    gender: db.STRING(2),
    language: db.STRING(),
    nickName: db.STRING(100),
    openId: db.STRING(),
    province: db.STRING(),
    UnionID: {
        type: db.STRING(),
        allowNull: true
    }
})