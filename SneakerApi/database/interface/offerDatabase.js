const mongoose = require("./database");
const resources = require("../../resource/constant");
const offerSchema = require("../schema/offerSchema");
const addressDatabase = require("./addressDatabase");
const resourcesConnection = resources.connections;
const userDatabase = require("./userDatabase");
const Validation = require('../../Util/Util').Validation
let offerModel;

async function connect() {
    offerModel = await mongoose.model(
        resourcesConnection.offerCollection,
        offerSchema
    );
}

connect();

async function _offerList() {
    return await offerModel.find();
}

async function _offerWithName(name) {
    return await offerModel.find({_name: name});
}

async function _offerWithId(id) {
    return offerModel.findOne({_id: id});
}

async function _deleteOfferWithId(id) {
    const offer = await _offerWithId(id)
    if (Validation.isObject(offer._pickUpAddress)) {
        await addressDatabase.deleteAddress(offer._pickUpAddress._id)
    }
    return offerModel.deleteOne({_id: id});
}


async function _addOffer(name, description, price, size, brand, condition, ownerName, address) {
    const offerObject = {
        _name: name,
        _description: description,
        _price: price,
        _size: size,
        _brand: brand,
        _condition: condition,
        _ownerName: ownerName,
        _address: {}
    }
    try {

        const user = await userDatabase.getUserWithUsername(ownerName);

        if (Validation.isEmptyObject(user._address)) {
            offerObject._address = user._address;
        }

        if (!address && !Validation.isEmptyObject(offerObject._address)) {
            return null
        }

        offerObject._address = Validation.isEmptyObject(offerObject._address) ? offerObject._address : {}

        offerObject._address._homeNumber = address.homeNumber;
        offerObject._address._cityName = address.cityName;
        offerObject._address._postCode = address.postCode;
        offerObject._address._streetName = address.cityName;

        if (offerObject._address._cityName && offerObject._address._streetName && offerObject._address._homeNumber && offerObject._address._postCode) {

            const newAddress = await addressDatabase.createAddress(offerObject._address._cityName, offerObject._address._homeNumber, offerObject._address._postCode, offerObject._address._streetName);
            offerObject._pickUpAddress = newAddress;
        }
        return await offerModel.create(offerObject);
    } catch (e) {
        return null
    }
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
    offerWithId: _offerWithId,
    deleteOfferWithId: _deleteOfferWithId
};
