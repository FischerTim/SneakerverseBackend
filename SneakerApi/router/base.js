const express = require("express");
let router = express.Router();
let resource = require('../resource/constant').paths

router.use((req,res,next)=>{
    req.data = {}
    next()
})

router.use((req,res,next)=>{

    req.userService  = require('../service/userService')();
    req.offerService = require("../service/offerService")();
    req.chatService = require("../service/chatService")();
    req.requestService = require("../service/requestService")();
    next()

})

const userRouter = require('./user')
router.use(resource.user,userRouter)

const offerRouter = require('./offer')
router.use(resource.offer,offerRouter)

const favoriteRouter = require('./favorite')
router.use(resource.favorite,favoriteRouter)

const chatRouter = require('./chat')
router.use(resource.chat,chatRouter)


module.exports = router