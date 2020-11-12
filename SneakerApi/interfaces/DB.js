let MongoDBCredentials = require('../ressources/credentials').development.MongoDBUser
let MongoClient = require('mongodb').MongoClient
const ressourcesMonDB = require('../ressources/MongoDb')

async function _connectToDBServer(){
    let connectionURl = ressourcesMonDB.connectionUrl
    connectionURl = connectionURl.replace("USERNAME",MongoDBCredentials.Username)
    connectionURl = connectionURl.replace("PASSWORD",MongoDBCredentials.Password)
    
    let dBConnection 

    try {
        dBConnection = await MongoClient.connect(connectionURl, { useUnifiedTopology: true })
                  
        
    } catch (err) {
        console.error(err)
        // Handle error
    } 
    return dBConnection
}

async function _getUserWithUsername(filter){
        const dBConnection = await _connectToDBServer()
        const document = dBConnection.db(ressourcesMonDB.BaseDocument)
        const collection = document.collection(ressourcesMonDB.UserCollection)
        return await collection.find().toArray()
}
module.exports = {connectToDBServer:_connectToDBServer, getUserWithUsername: _getUserWithUsername}