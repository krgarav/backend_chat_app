const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const Grouptable = sequelize.define('groupTable', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false
    },

});

module.exports = Grouptable;