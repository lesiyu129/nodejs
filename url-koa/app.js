"use strict"

const Koa = require('koa');

const app = new Koa();

const bodyParser = require('koa-bodyparser');

const controllers = require('./controllers');

app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    await next(); // 调用下一个middleware
});

app.use(async (ctx, next) => {
    const start = new Date().getTime(); // 当前时间
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`Time: ${ms}ms`); // 打印耗费时间
});

/**
 * 处理post请求
 *用router.get('/path', async fn)处理的是get请求。如果要处理post请求，可以用router.post('/path', async fn)。
 *用post请求处理URL时，我们会遇到一个问题：post请求通常会发送一个表单，或者JSON，它作为request的body发送，
 *但无论是Node.js提供的原始request对象，还是koa提供的request对象，都不提供解析request的body的功能！
 *所以，我们又需要引入另一个middleware来解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中。
 */

/**
 *由于middleware(中间键)的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上
 */
app.use(bodyParser());

/**
 *便利路由 
 */
app.use(controllers());

app.listen(3000, () => {
    console.log('app started at port 3000...');
});