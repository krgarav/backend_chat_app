const express = require("express");
const router = express.Router();

const authController = require("../Controller/auth")

router.post("/signup", authController.authSignup);

module.exports = router;