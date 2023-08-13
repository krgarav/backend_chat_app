const express = require("express");
const router = express.Router();

const authController = require("../Controller/auth")

router.post("/signup", authController.authSignup);
router.post("/login",authController.authLogin);

module.exports = router;