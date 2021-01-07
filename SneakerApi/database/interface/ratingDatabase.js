const mongoose = require("./database");
const resources = require("../../resource/constant");
const rateSchema = require("../schema/rateSchema");

const resourcesConnection = resources.connections;

let rateModel;

async function connect() {
    rateModel = await mongoose.model(
        resourcesConnection.ratingCollection,
        rateSchema
    );
}

connect();

async function createRate(targetUsername, rating, evaluatorName) {
    let newRate = {
        _targetUsername: targetUsername,
        _rating: rating,
    }
    if (evaluatorName) {
        newRate._evaluatorName = evaluatorName
    }
    return rateModel.create(newRate);
}

async function getRatingWithId(id) {
    return await rateModel.findById(id)
}
async function ratingWithIdExist(id){
    return rateModel.findById(id)?true:false
}
module.exports = {
    getRatingWithId,
    createRate,
    ratingWithIdExist
};
