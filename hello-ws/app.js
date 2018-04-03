//导入WebSocket模块
const WebSocket = require('ws');
//引用Server块并实例化
const wss = new WebSocket.Server({
    port: 3000
});
wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        setTimeout(() => {
            ws.send(`ECHO: ${message}`, (err) => {
                if (err) {
                    console.log(`[SERVER] error: ${err}`);
                }
            });
        }, 1000);
    });
    ws.on('close', function (close) {
        console.log('下线')
    })
});

// let count = 0;
// let ws = new WebSocket('ws://localhost:3000/ws/chat');
// ws.on('open', function () {
//     console.log(`[CLIENT] open()`);
//     ws.send('Hello!');
// })
// ws.on('message', function (message) {
//     console.log(`[CLIENT] Received: ${message}`);
//     count++;
//     if (count > 3) {
//         ws.send('Goodbye!');
//         ws.close();
//     } else {
//         setTimeout(() => {
//             ws.send(`Hello, I'm Mr No.${count}!`);
//         }, 1000);
//     }
// });