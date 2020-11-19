let express = require('express')
let router = express.Router()
let userService = require('../services/userService')
let authorizationService = require('../services/authorizationService')

function functionBasicSendBack(req,res){
    const result = {}
    result.accessToken = req.accessToken ? req.accessToken : {}
    result.data = req.data ? req.data : {}
    res.json(result)
}

router.get('/',  function (req,res){
  authorizationService.requestAuthorized(req,res)
  // to something
  authorizationService.addAuthorizationToResponse(req,res)
  functionBasicSendBack(req,res)
})
         

router.post('/login',async function(req,res){
  await userService.tryLogin(req,res)

  authorizationService.addAuthorizationToResponse(req,res)

  functionBasicSendBack(req,res)
})

router.post('/register',async function(req,res){
  await userService.tryRegistation(req,res)
  authorizationService.addAuthorizationToResponse(req,res)
  functionBasicSendBack(req,res)
})   


module.exports = router;
