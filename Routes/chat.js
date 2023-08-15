const express = require("express");
const router = express.Router();

const chatController = require("../Controller/chat")
const authenticate = require("../Middleware/auth");
router.post("/add-message",authenticate,chatController.postMessage);


module.exports = router;