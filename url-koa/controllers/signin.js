"use strict"
// sign in:
var model = require('../model');
module.exports = {
    'POST /signin': async (ctx, next) => {
        var
            email = ctx.request.body.email || '',
            password = ctx.request.body.password || '';

        var user = await model.usersModel.findAll({
            where: {
                email: email
            }
        })
        if (user.length) {
            console.log('signin failed!');
            ctx.render('signin-failed.html', {
                title: 'Sign In Failed'
            });
        } else {
            await model.usersModel.create({
                email: email,
                password: password,
                name: 'lesiyu',
                gender: '男'
            })
            console.log('signin ok!');
            ctx.render('signin-ok.html', {
                title: 'Sign In OK',
                name: 'Mr Node'
            });
        }
    }
};