let DB = require('../interfaces/DB')

    async function _login(username,password){
        console.log(username)
        const matchlist = await DB.getUserWithUsername(username)
        console.log(matchlist)
        if(matchlist.length > 0){
            return true
        }else{
            return false
        }
    }

module.exports = {login:_login }
