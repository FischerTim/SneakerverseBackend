const mongoose = require("./database");
const resources = require("../../resource/constant");
const citySchema = require("../schema/citySchema");

const resourcesConnection = resources.connections;

let cityModel;

async function connect() {
    cityModel = await mongoose.model(
        resourcesConnection.cityCollection,
        citySchema
    );
}

connect();


async function _createCity(latitude, longitude, cityName) {
    return await cityModel.create({
        _latitude: latitude,
        _longitude: longitude,
        _cityName: cityName
    })
}

async function _deleteCity(id) {
    return await cityModel.remove({_id: id})
}

module.exports = {
    createCity: _createCity,
    deleteCity: _deleteCity
};
