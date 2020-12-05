let express = require("express");
let router = express.Router();
let userService = require("../service/userService")();
let requestService = require("../service/requestService")();
let chatService = require("../service/chatService")();

router.get("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest
    ])
});

router.post("/logout", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        userService.logout
    ])
});

router.post("/login", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.login
    ])
});

router.post("/register", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.registration
    ])
});



module.exports = router;
