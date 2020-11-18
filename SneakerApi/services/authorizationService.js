
const jwt = require('jsonwebtoken')
const accessTokenSecret = 'youraccesstokensecret'

function _requestAuthorized(req, res){
    const authHeader = req.headers.authorization
    
    if (authHeader) {
        const token = authHeader.split(' ')[1]

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (!err) {
                req.user = user;
            }
            return 
        });
    } else {
        return 
    }
}

function _addAuthorizationToResponse(req,res){
    if(req.user){
        req.accessToken = jwt.sign({username: req.user.username, role: req.user.role}, accessTokenSecret)
    }else{
        return 
    }
}

module.exports = {requestAuthorized:_requestAuthorized ,addAuthorizationToResponse: _addAuthorizationToResponse}