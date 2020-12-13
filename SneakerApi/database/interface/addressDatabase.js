const mongoose = require("./database");
const resources = require("../../resource/constant");
const addressSchema = require("../schema/addressSchema");

const resourcesConnection = resources.connections;

let addressModel;

async function connect() {
    addressModel = await mongoose.model(
        resourcesConnection.addressCollection,
        addressSchema
    );
}

connect();


async function _createAddress(streetName, homeNumber, postCode, cityName) {
    return await addressModel.create({
        _streetName: streetName,
        _homeNumber: homeNumber,
        _postCode: postCode,
        _cityName: cityName
    })
}

async function _deleteAddress(id) {
    return await addressModel.remove({_id: id})
}

module.exports = {
    createAddress: _createAddress,
    deleteAddress: _deleteAddress
};
