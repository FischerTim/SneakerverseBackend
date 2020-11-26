let express = require("express");
let router = express.Router();
let ressources = require("../ressources/constant");
let userService = require("../services/userService");
let requestService = require("../services/requestService");

router.get("/", async function (req, res) {
  await requestService.runEachFunctionAsPipeline(req,res,[
      userService.authorizedRequest
  ])
});
router.post("/logout", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req,res,[
        userService.authorizedRequest,
        userService.logout
    ])
});

router.post("/login", async function (req, res) {
  await requestService.runEachFunctionAsPipeline(req,res,[
      userService.login
  ])
});

router.post("/register", async function (req, res) {
  await requestService.runEachFunctionAsPipeline(req,res,[
      userService.registration
  ])
});

module.exports = router;
