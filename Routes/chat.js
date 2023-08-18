const express = require("express");
const router = express.Router();

const chatController = require("../Controller/chat")
const authenticate = require("../Middleware/auth");
router.post("/add-message", authenticate, chatController.postMessage);
router.get("/get-message", authenticate, chatController.getMessage);
router.post("/createGroup", authenticate, chatController.createGroup);
router.get("/getGroup", authenticate, chatController.userGroupName);
router.get("/getUsers:groupId", authenticate, chatController.allUserPresentInGroup);
router.get("/getGroupChats:groupId", chatController.getGroupChats);
router.post("/updateGroupInfo", chatController.updateGroupInfo);

module.exports = router;