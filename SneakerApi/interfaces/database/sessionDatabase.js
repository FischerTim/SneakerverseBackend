const mongoose = require('./database')
const ressources = require('../../ressources/constant')
const sessionSchema = require('./schema/sessionSchema')

const ressourcesConnection = ressources.credentials

let sessionModel
async function connect(){
  sessionModel = await mongoose.model(ressourcesConnection.sessionCollection,sessionSchema)
}
connect()


async function _getRefreshToken(refreshToken){
  return await sessionModel.find({_refreshToken:refreshToken}) 
}

async function _createRefreshToken(refreshToken,userId){
  return await sessionModel.create({_userId:userId, _refreshToken:refreshToken})
}

module.exports = {
  createRefreshToken:_createRefreshToken,
  getRefreshToken:_getRefreshToken,
}