"use strict"

const Koa = require('koa');

const app = new Koa();

//导入处理request的模块
const bodyParser = require('koa-bodyparser');

//模板引擎模块
const templating = require('./templating');

//导入路由便利模块
const controllers = require('./controllers');

//导入ws模块
const ws = require('ws');

const url = require('url');

const Cookies = require('cookies');
const WebSocketServer = ws.Server;

//判断运行环境
/**
 * 注意：生产环境上必须配置环境变量NODE_ENV = 'production'，
 * 而开发环境不需要配置，实际上NODE_ENV可能是undefined，
 * 所以判断的时候，不要用NODE_ENV === 'development'。
 */
console.log(process.env.NODE_ENV);
const isProduction = process.env.NODE_ENV === 'production';

app.use(async (ctx, next) => {
    console.log(`${ctx.request.method} ${ctx.request.url}`); // 打印URL
    var start = new Date().getTime(); // 当前时间
    await next(); // 调用下一个middleware
    const ms = new Date().getTime() - start; // 耗费时间
    console.log(`Time: ${ms}ms`); // 打印耗费时间
});

//cookie:
app.use(async (ctx, next) => {
    ctx.state.user = parseUser(ctx.cookies.get('name') || '');
    await next();
});


/**
 * 处理post请求
 *用router.get('/path', async fn)处理的是get请求。如果要处理post请求，可以用router.post('/path', async fn)。
 *用post请求处理URL时，我们会遇到一个问题：post请求通常会发送一个表单，或者JSON，它作为request的body发送，
 *但无论是Node.js提供的原始request对象，还是koa提供的request对象，都不提供解析request的body的功能！
 *所以，我们又需要引入另一个middleware来解析原始request请求，然后，把解析后的参数，绑定到ctx.request.body中。
 */

/**
 * 处理静态文件
 */
if (!isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

/**
 *由于middleware(中间键)的顺序很重要，这个koa-bodyparser必须在router之前被注册到app对象上
 */
app.use(bodyParser());

/**
 * 调用模板引擎
 */
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

/**
 *便利路由 
 */
app.use(controllers());

/**
 * 启动服务
 */
let server = app.listen(3000);

/**
 * WebSocket
 */
function parseUser(obj) {
    if (!obj) {
        return;
    }
    console.log('try parse: ' + obj);
    let s = '';
    if (typeof obj === 'string') {
        s = obj;
    } else if (obj.headers) {
        let cookies = new Cookies(obj, null);
        s = cookies.get('name');
    }
    if (s) {
        try {
            let user = JSON.parse(Buffer.from(s, 'base64').toString());
            console.log(`User: ${user.name}, ID: ${user.id}`);
            return user;
        } catch (e) {
            // ignore
        }
    }
}

function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
    let wss = new WebSocketServer({
        server: server
    });
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    onConnection = onConnection || function () {
        console.log('[WebSocket] connected.');
    };
    onMessage = onMessage || function (msg) {
        console.log('[WebSocket] message received: ' + msg);
    };
    onClose = onClose || function (code, message) {
        console.log(`[WebSocket] closed: ${code} - ${message}`);
    };
    onError = onError || function (err) {
        console.log('[WebSocket] error: ' + err);
    };
    wss.on('connection', function (ws, req) {
        console.log(req.url);
        let location = url.parse(req.url, true);
        console.log('[WebSocketServer] connection: ' + location.href);
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);
        if (location.pathname !== '/ws/chat') {
            // close ws:
            ws.close(4000, 'Invalid URL');
        }
        // check user:
        let user = parseUser(req);
        if (!user) {
            ws.close(4001, 'Invalid user');
        }
        ws.user = user;
        ws.wss = wss;
        onConnection.apply(ws);
    });
    console.log('WebSocketServer was attached.');
    return wss;
}

var messageIndex = 0;

function createMessage(type, user, data) {
    messageIndex++;
    return JSON.stringify({
        id: messageIndex,
        type: type,
        user: user,
        data: data
    });
}

function onConnect() {
    let user = this.user;
    let msg = createMessage('join', user, `${user.name} joined.`);
    this.wss.broadcast(msg);
    // build user list:
    let users = new Array();
    this.wss.clients.forEach(function (value) {
        console.log(value.user);
        users.push(value.user);
    })
    this.send(createMessage('list', user, users));
}

function onMessage(message) {
    console.log(message);
    if (message && message.trim()) {
        let msg = createMessage('chat', this.user, message.trim());
        this.wss.broadcast(msg);
    }
}

function onClose() {
    let user = this.user;
    let msg = createMessage('left', user, `${user.name} is left.`);
    this.wss.broadcast(msg);
}

app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);

console.log('app started at port 3000...');