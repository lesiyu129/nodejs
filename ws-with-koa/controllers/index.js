"use strict"
// index:
const WXBizDataCrypt = require('../wx/WXBizDataCrypt');
const https = require('https');
const fs = require('fs');
const userModel = require('../models/usersModel')
module.exports = {
    'GET /': async (ctx, next) => {
        let user = ctx.state.user;
        if (user) {
            ctx.render('room.html', {
                user: user
            });
        } else {
            ctx.response.redirect('/signin');
        }
    },

    'POST /wx': async (ctx, next) => {
        var code = ctx.request.body.code
        var appId = 'wx7882d8264e560859'
        var appSecret = 'f30db23cef3fb45ef5a1711ce6672622'
        var sessionKey = '';
        var string = '';
        var json = {};
        var encryptedData = ctx.request.body.encryptedData;
        var iv = ctx.request.body.iv;
        await new Promise((resolve, reject) => {
            https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`, (res) => {
                res.on('data', (d) => {
                    string = d.toString()
                    json = JSON.parse(string);
                    sessionKey = json.session_key
                    resolve();
                })
            });
        })

        var pc = new WXBizDataCrypt(appId, sessionKey)
        var data = pc.decryptData(encryptedData, iv)
        //查询openid 判断是否第一次登陆
        var userdata = await userModel.findOne({
            where: {
                openId: data.openId
            }
        })
        if (!userdata) {
            await userModel.create({
                avatarUrl: data.avatarUrl,
                city: data.city,
                country: data.country,
                gender: data.gender,
                language: data.language,
                nickName: data.nickName,
                openId: data.openId,
                province: data.province
            })
        }

    },

    'POST /wx1': async (ctx, next) => {
        console.log(ctx.session.user);
    }

};