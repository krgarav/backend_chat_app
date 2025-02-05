const dotenv = require("dotenv");
const Sequelize = require('sequelize');
const path = require("path");
const fs = require("fs");

dotenv.config();
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//     dialect: "mysql",
//     host: process.env.DB_HOST || "localhost"
// });


// Validate that env variables are loaded
console.log("DB Config:", {
    name: process.env.DB_NAME,
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD ? "****" : "MISSING",
    host: process.env.DBHOSTNAME,
    port: process.env.DBPORT || 26370
});


const caCertPath = path.join(__dirname, "../", "ca.pem");
const caCert = fs.readFileSync(caCertPath);
// Sequelize Configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DBUSERNAME, process.env.DBPASSWORD, {
    host: process.env.DBHOSTNAME,
    dialect: 'mysql',
    port: 26370,
    dialectOptions: {
        ssl: {
            rejectUnauthorized: true,
            ca: caCert
        }
    }
});

module.exports = sequelize;

