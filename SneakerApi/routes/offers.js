let express = require("express");
let router = express.Router();
let ressources = require("../ressources/constant");
let offerservice = require("../services/offerservice");
let requestService = require("../services/requestService");
const userService = require("../services/userservice");

router.get("/", async function (req, res) {
  await requestService.runEachFunctionAsPipeline(req,res, [
        userService.authorizedRequest,
        offerservice.offerList
  ])
});

router.post("/insert", async function (req, res) {
  await requestService.runEachFunctionAsPipeline(req,res, [
    userService.authorizedRequest,
    offerservice.addOffer
  ])
});

module.exports = router;
