let express = require("express");
let router = express.Router();
let offerservice = require("../service/offerService")();
let requestService = require("../service/requestService")();
const userService = require("../service/userService")();

router.get("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerservice.offerList
    ])
});

router.post("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerservice.addOffer
    ])
});
router.delete("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        offerservice.deleteOffer
    ])
});

module.exports = router;
