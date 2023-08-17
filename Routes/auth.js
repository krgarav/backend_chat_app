const express = require("express");
const router = express.Router();

const authController = require("../Controller/auth");
const authMiddleware = require("../Middleware/auth");
router.post("/signup", authController.authSignup);
router.post("/login",authController.authLogin);
router.get("/getUser",authMiddleware,authController.getAllUserName);

module.exports = router;