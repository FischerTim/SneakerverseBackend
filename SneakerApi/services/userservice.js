
const bcrypt = require('bcrypt');
const ressource = require('../ressources/messages')

let DB = require('../interfaces/DB')

async function _login(username,password){
    
    const result = {status:400, msg:null, token:null}

    if(username != undefined && password != undefined){
        const matchlist = await DB.getUserWithUsername(username)
        if(matchlist.length <= 0){
            result.status = 400
            result.msg = ressource.failed.loginfailed
            return result
        }
        const user = matchlist[0]
    
        if(user.username == username && user.password == password  ){
            result.status = 200
            result.token = sessionDummy(username,password)
            result.msg = ressource.successed.logedin
            return result
        }
        result.status = 400
        result.msg = ressource.failed.loginfailed
        return result
        
    }     
}

async function sessionDummy(username,pw){
    const hash = await bcrypt.hash(username+pw,10)
    return hash
}

module.exports = {login:_login }
