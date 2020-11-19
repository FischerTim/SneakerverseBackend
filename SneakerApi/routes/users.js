let express = require('express')
let router = express.Router()
let ressources = require('../ressources/constant')
let userService = require('../services/userService')
let statusService = require('../services/statusService')
let authorizationService = require('../services/authorizationService')

function sendData(req,res){
    const result = {}
    result.accessToken = req.accessToken ? req.accessToken : {}
    res.json(result)
}

function sendError(req,res){
  const result = {}
  result.errorDescription = req.errorDescription ? req.errorDescription : ressources.responseMsg.default
  res.json(result)
}

router.get('/',  function (req,res){
  authorizationService.requestAuthorized(req,res)

  if(statusService.breakRequest(res)){
    sendError(req,res)
    return
  } 
  sendData(req,res)
})
         

router.post('/login',async function(req,res){
  await userService.login(req,res)

  if(statusService.breakRequest(res)){
    sendError(req,res)
    return
  } 

  authorizationService.addAuthorizationToResponse(req,res)

  if(statusService.breakRequest(res)){
    sendError(req,res)
    return
  } 

  sendData(req,res)
})

router.post('/register',async function(req,res){

  await userService.registation(req,res)

  if(statusService.breakRequest(res)){
    sendError(req,res)
    return
  } 
  authorizationService.addAuthorizationToResponse(req,res)

  if(statusService.breakRequest(res)){
    sendError(req,res)
    return
  } 
  sendData(req,res)
})   


module.exports = router;
