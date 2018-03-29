# nodejs
对nodejs的学习以及个人案列

 ":"号传参的用法例子
  router.get('/hello/:name', async (ctx, next) => {
   var name = ctx.params.name;
   ctx.response.body = `<h1>Hello, ${name}! </h1>`
  console.log('localhsot:3000/hello/koa')
 });
 

一个登陆的例子
koa2获取get，post参数
get：ctx.request.query.***;
post: ctx.request.bode.***;
 

 我们在使用npm install 安装模块或插件的时候，有两种命令把他们写入到 package.json 文件里面去，比如：
--save-dev
--save
在 package.json 文件里面提现出来的区别就是，使用 --save-dev 安装的 插件，被写入到 devDependencies 对象里面去，而使用 --save 安装的插件，责被写入到 dependencies 对象里面去。
那 package.json 文件里面的 devDependencies  和 dependencies 对象有什么区别呢？
devDependencies  里面的插件只用于开发环境，不用于生产环境，而 dependencies  是需要发布到生产环境的。

#模板引擎的使用
扩展
注意到ctx.render内部渲染模板时，Model对象并不是传入的model变量，而是：

Object.assign({}, ctx.state || {}, model || {})
这个小技巧是为了扩展。

首先，model || {}确保了即使传入undefined，model也会变为默认值{}。Object.assign()会把除第一个参数外的其他参数的所有属性复制到第一个参数中。第二个参数是ctx.state || {}，这个目的是为了能把一些公共的变量放入ctx.state并传给View。

例如，某个middleware负责检查用户权限，它可以把当前用户放入ctx.state中：

app.use(async (ctx, next) => {
    var user = tryGetUserFromCookie(ctx.request);
    if (user) {
        ctx.state.user = user;
        await next();
    } else {
        ctx.response.status = 403;
    }
});
这样就没有必要在每个Controller的async函数中都把user变量放入model中。

#数据表的自动建立。
执行 ： node init-db.js
程序将自动在数据库中创建表