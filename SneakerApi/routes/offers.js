let express = require("express");
let router = express.Router();
let ressources = require("../ressources/constant");
let offerservice = require("../services/offerservice");
let statusService = require("../services/statusService");
let authorizationService = require("../services/authorizationService");

function sendData(req, res) {
  const result = {};
  result.accessToken = req.accessToken ? req.accessToken : {};
  result.data = req.data ? req.data : {};
  res.json(result);
}

function sendError(req, res) {
  const result = {};
  result.errorDescription = req.errorDescription
    ? req.errorDescription
    : ressources.responseMsg.default;
  res.json(result);
}
function addDataToReq(req){
  req.data={}
}

router.get("/", async function (req, res) {
  authorizationService.requestAuthorized(req, res);


  addDataToReq(req)

  if (statusService.resquestFaild(res)) {

    sendError(req, res);
    return;
  }

  await offerservice.offerList(req, res);

  if (statusService.resquestFaild(res)) {
    sendError(req, res);
    return;
  }
  sendData(req, res);
});

router.post("/", async function (req, res) {
  authorizationService.requestAuthorized(req, res);

  addDataToReq(req)

  if (statusService.resquestFaild(res)) {
    sendError(req, res);
    return;
  }

  await offerservice.addOffer(req, res);

  if (statusService.resquestFaild(res)) {
    sendError(req, res);
    return;
  }

  sendData(req, res);
});
module.exports = router;
