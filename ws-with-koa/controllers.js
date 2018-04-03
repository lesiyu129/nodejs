'use strict'
const fs = require('fs');

const Router = require('koa-router');

var addControllers = (router, controllers_dir) => {
    var files = fs.readdirSync(__dirname + '/' + controllers_dir);
    // 过滤出.js文件:
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });
    //处理每个.js文件
    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        //导入js文件
        let mapping = require(__dirname + '/' + controllers_dir + '/' + f);
        for (var url in mapping) {
            //startsWith 字符串检查
            if (url.startsWith('GET ')) {
                // 如果url类似"GET xxx":
                var path = url.substring(4);
                router.get(path, mapping[url]);
                console.log(`register URL mapping: GET ${path}`);
            } else if (url.startsWith('POST ')) {
                // 如果url类似"POST xxx":
                var path = url.substring(5);
                router.post(path, mapping[url]);
                console.log(`register URL mapping: POST ${path}`);
            } else if (url.startsWith('PUT ')) {
                // 如果url类似"PUT xxx":
                var path = url.substring(4);
                console.log(`register URL mapping: POST ${path}`);
            } else if (url.startsWith('DELETE ')) {
                // 如果url类似"DELETE xxx":
                var path = url.substring(7);
                console.log(`register URL mapping: POST ${path}`);
            } else {
                // 无效的URL:
                console.log(`invalid URL: ${url}`);
            }
        }
    };
}

module.exports = (dir) => {
    let controllers_dir = dir || 'controllers'; // 如果不传参数，扫描目录默认为'controllers'
    let router = new Router();
    addControllers(router, controllers_dir);
    return router.routes();
}