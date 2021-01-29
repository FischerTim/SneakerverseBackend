const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const requestService = require("../service/requestService")();

router.get("/", userService.authorizedRequest, requestService.sendData);

router.post("/logout", userService.authorizedRequestNew, userService.logout, requestService.sendData);

router.post("/login", userService.login, requestService.sendData);

router.post("/register", userService.registration, requestService.sendData);

module.exports = router;
