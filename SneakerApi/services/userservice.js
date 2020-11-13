const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';

let DB = require('../interfaces/DB')

async function _tryLogin(req,res){
    if(req.body.user){
        const requestUser = req.body.user
 
        const matchlist = await DB.getUserWithUsername(requestUser.username)
        if(matchlist.length <= 0){
            return 
        }
        const dBUser = matchlist[0]
        if(requestUser.username == dBUser.username && requestUser.password == dBUser.password  ){
            req.user = { username:dBUser.username, role: dBUser.role}
        }else{
            return 
        }

    }else{
        return
    }
}

module.exports = {tryLogin:_tryLogin}
