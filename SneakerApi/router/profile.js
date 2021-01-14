const router = require("express").Router();
const userService = require("../service/userService")();
const requestService = require("../service/requestService")();

router.post("/get", async function (req, res) {
    await requestService.runEachFunctionAsPipeline(req, res, [
        userService.authorizedRequest,
        userService.getProfile
    ])
});



module.exports = router;
