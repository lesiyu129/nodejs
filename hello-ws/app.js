//导入WebSocket模块
const Ws = require('ws');
//引用Server块并实例化
const wss = new Ws().Server({
    port: 3000
});