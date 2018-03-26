const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const router = new Router();


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
app.use(bodyParser()); //由于middleware(中间键)的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上

//router
/** ":"号传参的用法例子
 * router.get('/hello/:name', async (ctx, next) => {
 *  var name = ctx.params.name;
 *  ctx.response.body = `<h1>Hello, ${name}! </h1>`
 *  console.log('localhsot:3000/hello/koa')
 * });
 */

//一个登陆的例子
/**
 * koa2获取get，post参数
 * get：ctx.request.query.***;
 * post: ctx.request.bode.***;
 */
router.get('/', async (ctx, next) => {
    ctx.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', async (ctx, next) => {
    var name = ctx.request.body.name || '';
    var password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.body = `<h1>Welcome, ${name}!</h1>`;
    } else {
        ctx.body = `<h1>Login failed!</h1>
        <p><a href="/">Try again</a></p>`;
    }
});


app.use(router.routes()); //注入路由
app.use(router.allowedMethods());



app.listen(3000, () => {
    console.log('app started at port 3000...');
});