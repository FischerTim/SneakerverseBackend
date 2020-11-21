const mongoose = require("./database");
const ressources = require("../../ressources/constant");
const offerSchema = require("./schema/offerSchema");

const ressourcesConnection = ressources.connections;

let offerModel;

async function connect() {
  offerModel = await mongoose.model(
    ressourcesConnection.offerCollection,
    offerSchema
  );
}
connect();

async function _offerList() {
  return await offerModel.find();
}

async function _offerWithName(name) {
  return await offerModel.find({ _name: name });
}

async function _addOffer(name) {
  return await offerModel.create({ _name: name });
}

/*
async function _deleteTodoById(id){
  return userModel.deleteOne({_id:id}) 
}

async function _updateTodo(_title, _completed, id){
  return userModel.updateOne({_id: id}, {title:_title, completed: _completed} )
}*/

module.exports = {
  offerList: _offerList,
  offerWithName: _offerWithName,
  addOffer: _addOffer,
};
