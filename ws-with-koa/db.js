//模型定义规范
const Sequelize = require('sequelize');
const config = require('./config').lsyMysql;
console.log('init sequelize...');

var sequelize = new Sequelize(config.database, config.username, config.password, config.options);

const ID_TYPE = Sequelize.STRING;

var defineModel = (name, attributes) => {
    var attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    attrs.id = {
        type: ID_TYPE,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    };
    attrs.createdAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.updatedAt = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        //创建一个钩子
        hooks: {
            //在验证之前执行
            beforeValidate: function (obj) {
                let now = Date.now();
                //判断是否有新的记录
                if (obj.isNewRecord) {
                    obj.createdAt = now;
                    obj.updatedAt = now;
                    obj.version = 0;
                } else {
                    obj.updatedAt = Date.now();
                    obj.version++;
                }
            }
        }
    });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATEONLY', 'BOOLEAN'];

var db = {
    defineModel: defineModel,
    sync: (bool) => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({
                force: bool || false
            });
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};
for (let type of TYPES) {
    db[type] = Sequelize[type];
};
module.exports = db;