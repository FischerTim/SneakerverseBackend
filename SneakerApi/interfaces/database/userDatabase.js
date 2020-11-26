const mongoose = require("./database");
const ressources = require("../../ressources/constant");
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
  updateUserToken:_updateUserToken
};
