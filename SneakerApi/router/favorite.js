const express = require("express");
const router = express.Router();
const userService = require("../service/userService")();
const requestService = require("../service/requestService")();

router.post("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        userService.addFavoriteId
    ])
});

router.delete("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        userService.removeFavoriteId
    ])
});
router.get("/", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        userService.getFavoritesId
    ])
});


module.exports = router;
