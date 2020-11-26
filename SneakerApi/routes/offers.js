let express = require("express");
let router = express.Router();
let ressources = require("../resources/constant");
let offerservice = require("../services/offerservice");
let requestService = require("../services/requestService");
const userService = require("../services/userservice");

router.get("/", async function (req, res) {
  await requestService.runEachFunctionAsPipeline(req,res, [
    userService.authorizedRequest,
    offerservice.offerList
  ])
});

router.post("/", async function (req, res) {
  await requestService.runEachFunctionAsPipeline(req,res, [
    userService.authorizedRequest,
    offerservice.addOffer
  ])
});
router.delete("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req,res, [
        userService.authorizedRequest,
        offerservice.deleteOffer
    ])
});

module.exports = router;
