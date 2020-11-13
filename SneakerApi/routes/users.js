let express = require('express')
let router = express.Router()
let userService = require('../services/userservice')
let devCredentials = require('../ressources/credentials').development

/* GET users listing. */
router.get('/', function(req, res, next) {

  
  res.send('respond with a resource');
});

router.post('/login', async function(req, res, next){
    console.log(req.session)
    const username = req.body.username
    const password = req.body.password

    let result 
    try{
      result = await userService.login(username, password)
    }catch(err){
      console.error(err)
    }
    const response = {msg:result.msg}
    const decStatus = parseInt(result.status)
    console.log(decStatus)
    if(decStatus >=200 && decStatus < 300){
      
      response.token = await result.token
    }
    res.status(result.status).json(response)
})

module.exports = router;
