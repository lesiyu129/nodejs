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
 
