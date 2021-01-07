const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const requestService = require("../service/requestService")();
const chatService = require("../service/chatService")();

router.post("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        chatService.addChat
    ])
});

router.get("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        chatService.chatListOfUser
    ])
});

router.get("/selected", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        chatService.chatsWithIds
    ])
});

router.post("/message", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        chatService.addMessage
    ])
});


module.exports = router;
