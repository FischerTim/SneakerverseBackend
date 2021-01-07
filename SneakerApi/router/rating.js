const express = require("express");
const router = express.Router();
const ratingService = require("../service/ratingService")();
const requestService = require("../service/requestService")();
const userService = require("../service/userService")();

router.get("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        ratingService.getRatingsWithIds
    ])
});

router.post("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        ratingService.addRating
    ])
});

module.exports = router;
