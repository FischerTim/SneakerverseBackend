let express = require('express')
let router = express.Router()
let userService = require('../services/userservice')
let devCredentials = require('../ressources/credentials').development

/* GET users listing. */
router.get('/', function(req, res, next) {

  
  res.send('respond with a resource');
});

router.post('/login', async function(req, res, next){
  console.log(devCredentials)
    res.send(await userService.login(devCredentials.TestUser.Username,devCredentials.TestUser.Password))
})

module.exports = router;
