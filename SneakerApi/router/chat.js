const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const requestService = require("../service/requestService")();
const chatService = require("../service/chatService")();

router.post("/", userService.authorizedRequestNew, chatService.addChat, requestService.sendData);

router.get("/", userService.authorizedRequestNew, chatService.chatListOfUser, requestService.sendData);

router.get("/selected", userService.authorizedRequestNew, chatService.chatsWithIds, requestService.sendData);

router.post("/message", userService.authorizedRequestNew, chatService.addMessage, requestService.sendData);

module.exports = router;
