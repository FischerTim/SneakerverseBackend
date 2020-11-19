const _credentials = {
    MongoDBUser : {
        Username:'admin',
        Password:'tefK1CgrHYasdasdMVLqG' 
    },  
    TestUser: {
        Username:'TestUser',
        Password:'TestPassword' 
    },
    
}
const _connections = {
    database:'main',
    userCollection: 'user',
    sessionCollection: 'session',
    constInConnectionUrl: {
        USERNAME:"<USERNAME>",
        PASSWORD:"<PASSWORD>",
        DATABASE:"<DATABASE>"
    },
    connectionUrl: 'mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.57rjy.mongodb.net/<DATABASE>?retryWrites=true&w=majority'

}
const _responseMsg = {
    default:'Sorry something went wrong. Please try it again',
    userBodyMissig:'Please add {user:{username:YOURUSERNAME, password:YOURPASSWORD}} to request body',
    unauthorized:"username password combination is not correct",
    userNameAlreadyUsed:"This username is already used",
    invalidHeader:'The header is not valid',
    invalidToken:'This Token is not valid, please relogin'
}

module.exports = {credentials:_credentials, connections:_connections,responseMsg:_responseMsg}