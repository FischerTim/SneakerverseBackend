const express = require("express");
const router = express.Router();
const resource = require('../Util/resource/constant').paths

router.use((req, res, next) => {
    req.data = {}
    next()
})

router.use((req, res, next) => {

    req.userService = require('../service/userService')();
    req.offerService = require("../service/offerService")();
    req.chatService = require("../service/chatService")();
    req.requestService = require("../service/requestService")();
    req.websocketService = require('../service/webSocketService')();
    next()

})


const userRouter = require('./user')
router.use(resource.user, userRouter)

const offerRouter = require('./offer')
router.use(resource.offer, offerRouter)

const favoriteRouter = require('./favorite')
router.use(resource.favorite, favoriteRouter)

const chatRouter = require('./chat')
router.use(resource.chat, chatRouter)

const profileRouter = require('./profile')
router.use(resource.profile, profileRouter)

const ratingRouter = require('./rating')
router.use(resource.rating, ratingRouter)

const staticRouter = require('./static')
router.use(resource.static, staticRouter)

module.exports = router