const router = require("express").Router();
const userService = require("../service/userService")();
const requestService = require("../service/requestService")();

router.post("/get", userService.authorizedRequestNew, userService.getProfile, requestService.sendData);

module.exports = router;
