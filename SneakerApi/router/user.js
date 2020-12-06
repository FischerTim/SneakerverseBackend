const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const requestService = require("../service/requestService")();

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
