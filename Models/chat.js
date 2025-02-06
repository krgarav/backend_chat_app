const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const Chat = sequelize.define('chats', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    message: {
        type: Sequelize.TEXT,
        allowNull:false
    },
    fileUrl: { type: Sequelize.STRING },
    receiverId: { type: Sequelize.INTEGER }
});

module.exports = Chat;