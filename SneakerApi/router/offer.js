const express = require("express");
const router = express.Router();
const offerService = require("../service/offerService")();
const requestService = require("../service/requestService")();
const userService = require("../service/userService")();
const upload = require('../service/imageService')()

router.get("/", userService.authorizedRequestNew, offerService.offerList, requestService.sendData);

router.post("/selected", userService.authorizedRequestNew, offerService.offersWithIds, requestService.sendData);

router.post("/", userService.authorizedRequestNew, offerService.addOffer, requestService.sendData);

router.delete("/", userService.authorizedRequestNew, offerService.deleteOffer, requestService.sendData);

router.post("/upload", upload.array('pic'), userService.authorizedRequestNew, offerService.addImages, requestService.sendData);

module.exports = router;
