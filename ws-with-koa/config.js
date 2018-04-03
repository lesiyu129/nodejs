"use strict"
module.exports = {
    lsyMysql: {
        database: "mydb", //数据库名称
        username: "root", //账户
        password: "root", //密码
        options: {
            host: "localhost", //数据库连接URL
            dialect: "mysql", //数据库使用方言
            port: "3306", //数据库端口号
            timezone: "+08:00", //时差设置
            pool: { //连接池设置
                max: "80", //连接池最大链接数量
                min: "5", //连接池最小链接数量
                idle: "10000" //链接释放空闲时间设置(毫秒)
            },
            operatorsAliases: false //取消别名（http://docs.sequelizejs.com/manual/tutorial/querying.html#operators）
        }

    }
}