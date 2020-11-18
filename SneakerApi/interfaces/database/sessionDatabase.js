const mongoose = require('./database')
const ressources = require('../../ressources/constant')
const sessionSchema = require('./schema/sessionSchema')

const ressourcesConnection = ressources.credentials

let sessionModel
async function connect(){
  sessionModel = await mongoose.model(ressourcesConnection.sessionCollection,sessionSchema)
}
connect()

async function _getUsers(){
    return await sessionModel.find()
}

async function _getUserWithUsername(username){
  return await sessionModel.find({_username:username}) 
}

async function _registerUser(username,password){
  return await sessionModel.create({_username:username, _password:password})
}
/*
async function _deleteTodoById(id){
  return userModel.deleteOne({_id:id}) 
}

async function _updateTodo(_title, _completed, id){
  return userModel.updateOne({_id: id}, {title:_title, completed: _completed} )
}*/

module.exports = {
  getUserWithUsername:_getUserWithUsername,
  getUsers:_getUsers,
  registerUser:_registerUser
  
}