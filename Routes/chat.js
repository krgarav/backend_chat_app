const express = require("express");
const router = express.Router();

const chatController = require("../Controller/chat")
const authenticate = require("../Middleware/auth");
router.post("/add-message",authenticate,chatController.postMessage);
router.get("/get-message",authenticate,chatController.getMessage);

module.exports = router;