const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const requestService = require("../service/requestService")();

router.post("/", userService.authorizedRequestNew, userService.addFavoriteId, requestService.sendData);

router.delete("/", userService.authorizedRequestNew, userService.removeFavoriteId, requestService.sendData);

router.get("/", userService.authorizedRequestNew, userService.getFavoritesId, requestService.sendData);


module.exports = router;
