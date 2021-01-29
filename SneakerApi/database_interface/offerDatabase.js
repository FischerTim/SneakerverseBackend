const mongoose = require("./database");
const resources = require("../Util/resource/constant");
const offerSchema = require("../Model/offerSchema");
const cityDatabase = require("./cityDatabase");
const resourcesConnection = resources.connections;
const userDatabase = require("./userDatabase");
const Validation = require('../Util/Util').Validation
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
    if (Validation.isObject(offer._city)) {
        await cityDatabase.deleteCity(offer._city._id)
    }
    return offerModel.deleteOne({_id: id});
}

async function offerWithIdExist(id) {
    return offerModel.findOne({_id: id}) ? true : false;
}

async function _addOffer(name, description, price, size, brand, condition, ownerName, city, ownerId) {
    const offerObject = {
        _name: name,
        _description: description,
        _price: price,
        _size: size,
        _brand: brand,
        _condition: condition,
        _ownerName: ownerName,
        _ownerId: ownerId,
        _cityName: {}
    }
    try {

        const user = await userDatabase.getUserWithUsername(ownerName);

        if (!Validation.isEmptyObject(user._city)) {
            offerObject._city = user._city;
        }

        if (!city && !Validation.isEmptyObject(offerObject._city)) {
            return null
        }

        offerObject._city = Validation.isEmptyObject(offerObject._city) ? offerObject._city : {}

        offerObject._city._latitude = city.latitude;
        offerObject._city._cityName = city.cityName;
        offerObject._city._longitude = city.longitude;


        if (offerObject._city._cityName && offerObject._city._longitude && offerObject._city._latitude) {
            const newCity = await cityDatabase.createCity(offerObject._city._latitude, offerObject._city._longitude, offerObject._city._cityName);
            offerObject._city = newCity;
        }
        return await offerModel.create(offerObject);
    } catch (e) {
        console.log(e)
        return null
    }
}


async function addImageToOffer(id, obj) {
    //Todo this is a test need to create obj in this method
    const offer = await offerModel.findOne({_id: id});
    offer._img = offer._img ? offer._img : []
    offer._img.push(obj)
    return await offerModel.updateOne({_id: id}, {_img: offer._img})
}

/*
async function _updateTodo(_title, _completed, id){
  return userModel.updateOne({_id: id}, {title:_title, completed: _completed} )
}*/

module.exports = {
    offerList: _offerList,
    offerWithName: _offerWithName,
    addOffer: _addOffer,
    offerWithId: _offerWithId,
    deleteOfferWithId: _deleteOfferWithId,
    offerWithIdExist, addImageToOffer
};
