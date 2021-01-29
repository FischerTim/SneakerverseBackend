const express = require("express");
const router = express.Router();
const ratingService = require("../service/ratingService")();
const requestService = require("../service/requestService")();
const userService = require("../service/userService")();

router.post("/get", userService.authorizedRequestNew, ratingService.getRatingsWithIds, requestService.sendData);

router.post("/", userService.authorizedRequestNew, ratingService.addRating, requestService.sendData);

module.exports = router;
