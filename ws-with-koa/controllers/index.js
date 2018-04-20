"use strict"
// index:
const WXBizDataCrypt = require('../wx/WXBizDataCrypt');
const https = require('https');
const fs = require('fs');
const userModel = require('../models/usersModel')
const score_2048Model = require('../models/score_2048Model');
userModel.hasOne(score_2048Model);
score_2048Model.belongsTo(userModel);
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
                unionID: data.unionID,
                province: data.province
            })
            userdata = await userModel.findOne({
                where: {
                    openId: data.openId
                }
            })
            ctx.body = userdata.id;
        } else {
            ctx.body = userdata.id;
        }

    },

    'POST /wx_sub': async (ctx, next) => {
        var user_score = await score_2048Model.findOne({
            where: {
                userId: ctx.request.body.userId
            }
        })
        if (user_score) {
            var score_2048 = await score_2048Model.findOne({
                where: {
                    userId: ctx.request.body.userId
                }
            })
            if (score_2048.score < ctx.request.body.score) {
                await score_2048Model.update({
                    score: ctx.request.body.score,
                }, {
                    where: {
                        userId: ctx.request.body.userId
                    }
                })
                ctx.body = '分数提交完毕';
                return
            }
            ctx.body = '为超过记录值';

        } else {
            await score_2048Model.create({
                userId: ctx.request.body.userId,
                score: ctx.request.body.score
            })
            ctx.body = '分数创建完毕';
        }


    },

    'POST /wx_list': async (ctx, next) => {
        var user = await score_2048Model.findAll({
            order: [
                ['score', 'DESC']
            ],

            include: {
                model: userModel
            },

        })
        console.log(user)
        ctx.body = user
    }
};