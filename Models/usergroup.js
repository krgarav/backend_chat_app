const Sequelize = require("sequelize");
const sequelize = require("../Utils/database");

const UserGroup = sequelize.define('UserGroup', {
    isAdmin: Sequelize.BOOLEAN
});
module.exports = UserGroup;