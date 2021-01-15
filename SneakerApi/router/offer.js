const express = require("express");
const router = express.Router();
const offerService = require("../service/offerService")();
const requestService = require("../service/requestService")();
const userService = require("../service/userService")();
const upload = require('../service/imageService')()

router.get("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerService.offerList
    ])
});
router.get("/selected", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerService.offersWithIds
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
router.post("/upload", upload.single('pic') , async function (req, res) {
    console.log("HAllo")
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerService.addImages
    ])
});


module.exports = router;
