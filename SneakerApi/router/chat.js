let express = require("express");
let router = express.Router();
let userService = require("../service/userService")();
let requestService = require("../service/requestService")();
let chatService = require("../service/chatService")();

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

module.exports = router;
