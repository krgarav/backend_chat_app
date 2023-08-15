const Users = require("../Models/user");
const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const userId = jwt.verify(token, "secrettoken");
        const user = await Users.findByPk(userId.user_id);
        req.user = user;
        next();
    } catch (err) {
        console.log(err);
    }
}

module.exports = authenticate;