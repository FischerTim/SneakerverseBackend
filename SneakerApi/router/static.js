const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const staticService = require("../service/staticService")();
const requestService = require("../service/requestService")();

router.get("/blog", userService.authorizedRequestNew, staticService.blog, requestService.sendData);

router.get("/releaseCalendar", userService.authorizedRequestNew, staticService.releaseCalendar, requestService.sendData);

module.exports = router;
