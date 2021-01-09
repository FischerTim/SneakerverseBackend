const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const staticService= require("../service/staticService")();
const requestService = require("../service/requestService")();

router.get("/blog", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        staticService.blog
    ])
});

router.get("/releaseCalendar", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        staticService.releaseCalendar
    ])
});

module.exports = router;
