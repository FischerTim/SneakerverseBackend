const mongoose = require("./database");
const ressources = require("../../resource/constant");
const userSchema = require("../schema/userSchema");

const ressourcesConnection = ressources.connections;

let userModel;

async function connect() {
    userModel = await mongoose.model(
        ressourcesConnection.userCollection,
        userSchema
    );
}

connect();

async function getUsers() {
    return await userModel.find();
}

async function getUserWithUsername(username) {
    return userModel.findOne({_username: username});
}

async function getUserWithId(id) {
    return userModel.findById(id);
}

async function idExist(id) {
    try {
        if (await userModel.findById(id)) {
            return true
        }
        ;
        return false
    } catch (e) {
        return false
    }

}

async function registerUser(username, password) {
    return await userModel.create({_username: username, _password: password});
}

async function updateUserToken(username, token) {
    return userModel.updateOne({_username: username}, {_sessionToken: token})
}

async function addOfferId(username, id) {
    let user = await userModel.findOne({_username: username});
    user._offers.push(id)
    return userModel.updateOne({_username: username}, {_offers: user._offers})
}

async function removeOfferId(username, id) {
    let user = await userModel.findOne({_username: username});
    let offerWithoutId = user._offers.filter(_id => _id != id)
    return userModel.updateOne({_username: username}, {_offers: offerWithoutId})
}

async function addFavoriteId(username, id) {
    let user = await userModel.findOne({_username: username});
    user._favorites.push(id)
    return userModel.updateOne({_username: username}, {_favorites: user._favorites})
}

async function removeFavoriteId(username, id) {
    let user = await userModel.findOne({_username: username});
    let favoritesWithoutId = user._favorites.filter(_id => _id != id)
    return userModel.updateOne({_username: username}, {_favorites: favoritesWithoutId})
}

async function getFavoriteId(username) {
    let user = await userModel.findOne({_username: username});
    return user._favorites
}

async function addChatId(username, id) {
    let user = await userModel.findOne({_username: username});
    user._chats.push(id)
    return userModel.updateOne({_username: username}, {_chats: user._chats})
}

async function getChats(id) {
    const user = await userModel.findById(id)
    return user._chats
}
async function addRatingId(username, id) {
    let user = await userModel.findOne({_username: username});
    user._ratings.push(id)
    return userModel.updateOne({_username: username}, {_ratings: user._ratings})
}

async function getRating(id) {
    const user = await userModel.findById(id)
    return user._ratings
}


module.exports = {
    addRatingId,
    getRating,
    getUserWithUsername,
    getUsers,
    registerUser,
    getFavoriteId,
    updateUserToken,
    addOfferId,
    removeOfferId,
    addFavoriteId,
    removeFavoriteId,
    addChatId,
    getUserWithId,
    idExist,
    getChats
};
