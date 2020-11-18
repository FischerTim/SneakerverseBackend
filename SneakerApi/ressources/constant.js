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

module.exports = {credentials:_credentials, connections:_connections}