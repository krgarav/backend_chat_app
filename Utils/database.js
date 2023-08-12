const Sequelize = require('sequelize');
const sequelize = new Sequelize("chat_app", "root" ,"123456789" , {
    dialect: "mysql",
    host: "localhost"
});

module.exports = sequelize;