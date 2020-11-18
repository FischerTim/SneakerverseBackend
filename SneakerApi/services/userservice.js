const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

let userDatabase = require('../interfaces/database/userDatabase')

async function _tryLogin(req,res){
    if(req.body.user){
        const requestUser = req.body.user
 
        const matchlist = await userDatabase.getUserWithUsername(requestUser.username)
        if(matchlist.length <= 0){
            return 
        }
        const dBUser = matchlist[0]
        if(requestUser.username == dBUser._username && requestUser.password == dBUser._password  ){
            req.user = { username: dBUser._username, role: dBUser._role}
        }else{
            return 
        }

    }else{
        return
    }
}
async function _tryRegistation(req,res){
    if(req.body.user){
        const requestUser = req.body.user
 
        const matchlist = await userDatabase.getUserWithUsername(requestUser.username)
        if(matchlist.length > 0){
            return 
        }
        await userDatabase.registerUser(requestUser.username,requestUser.password)

        return await _tryLogin(req,res)
    }else{
        return
    }
}

module.exports = {tryLogin:_tryLogin,tryRegistation:_tryRegistation}
