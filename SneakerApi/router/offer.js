const express = require("express");
const router = express.Router();
const offerService = require("../service/offerService")();
const requestService = require("../service/requestService")();
const userService = require("../service/userService")();

router.get("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerService.offerList
    ])
});

router.post("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerService.addOffer
    ])
});
router.delete("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerService.deleteOffer
    ])
});

module.exports = router;
