const mongoose = require("./database");
const ressources = require("../../resources/constant");
const userSchema = require("./schema/userSchema");

const ressourcesConnection = ressources.connections;

let userModel;

async function connect() {
  userModel = await mongoose.model(
    ressourcesConnection.userCollection,
    userSchema
  );
}
connect();

async function _getUsers() {
  return await userModel.find();
}

async function _getUserWithUsername(username) {
  return await userModel.find({ _username: username });
}

async function _registerUser(username, password) {
  return await userModel.create({ _username: username, _password: password });
}
async function _updateUserToken(username,token){
  return userModel.updateOne({_username: username}, {_sessionToken:token} )
}
async function _addOfferId(username,id){
  let user = await userModel.findOne({_username: username});
  user._offers.push(id)
  return userModel.updateOne({_username: username}, {_offers: user._offers} )
}
async function _removeOfferId(username,id){
  let user = await userModel.findOne({_username: username});
  let offerWithoutId = user._offers.filter(_id =>  _id != id)
  console.log(offerWithoutId)
  return userModel.updateOne({_username: username}, {_offers: offerWithoutId} )
}


/*
async function _deleteTodoById(id){
  return userModel.deleteOne({_id:id}) 
}

async function _updateTodo(_title, _completed, id){
  return userModel.updateOne({_id: id}, {title:_title, completed: _completed} )
}*/

module.exports = {
  getUserWithUsername: _getUserWithUsername,
  getUsers: _getUsers,
  registerUser: _registerUser,
  updateUserToken:_updateUserToken,
  addOfferId:_addOfferId,
  removeOfferId:_removeOfferId
};
