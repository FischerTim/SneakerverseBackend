const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const staticService = require("../service/staticService")();
const requestService = require("../service/requestService")();

router.get("/blog", userService.authorizedRequestNew, staticService.blog, requestService.sendData);

router.get("/releaseCalendar/2", userService.authorizedRequestNew, staticService.releaseCalendar, requestService.sendData);
router.get("/releaseCalendar/1", userService.authorizedRequestNew, staticService.releaseCalendarM1, requestService.sendData);
module.exports = router;
