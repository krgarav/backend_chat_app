const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const Archive = sequelize.define('archive', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey:true
        
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fileUrl: { type: Sequelize.STRING }


});

module.exports = Archive;