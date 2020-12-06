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

async function _getUsers() {
    return await userModel.find();
}

async function _getUserWithUsername(username) {
    return userModel.findOne({_username: username});
}

async function _getUserWithId(id) {
    return userModel.findById(id);
}

async function _idExist(id) {
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

async function _registerUser(username, password) {
    return await userModel.create({_username: username, _password: password});
}

async function _updateUserToken(username, token) {
    return userModel.updateOne({_username: username}, {_sessionToken: token})
}

async function _addOfferId(username, id) {
    let user = await userModel.findOne({_username: username});
    user._offers.push(id)
    return userModel.updateOne({_username: username}, {_offers: user._offers})
}

async function _removeOfferId(username, id) {
    let user = await userModel.findOne({_username: username});
    let offerWithoutId = user._offers.filter(_id => _id != id)
    return userModel.updateOne({_username: username}, {_offers: offerWithoutId})
}

async function _addFavoriteId(username, id) {
    let user = await userModel.findOne({_username: username});
    user._favorites.push(id)
    return userModel.updateOne({_username: username}, {_favorites: user._favorites})
}

async function _removeFavoriteId(username, id) {
    let user = await userModel.findOne({_username: username});
    let favoritesWithoutId = user._favorites.filter(_id => _id != id)
    return userModel.updateOne({_username: username}, {_favorites: favoritesWithoutId})
}

async function _getFavoriteId(username) {
    let user = await userModel.findOne({_username: username});
    return user._favorites
}

async function _addChatId(username, id) {
    let user = await userModel.findOne({_username: username});
    user._chats.push(id)
    return userModel.updateOne({_username: username}, {_chats: user._chats})
}

async function _getChats(id) {
    const user = await userModel.findById(id)
    return user._chats
}

module.exports = {
    getUserWithUsername: _getUserWithUsername,
    getUsers: _getUsers,
    registerUser: _registerUser,
    getFavoriteId: _getFavoriteId,
    updateUserToken: _updateUserToken,
    addOfferId: _addOfferId,
    removeOfferId: _removeOfferId,
    addFavoriteId: _addFavoriteId,
    removeFavoriteId: _removeFavoriteId,
    addChatId: _addChatId,
    getUserWithId: _getUserWithId,
    idExist: _idExist,
    getChats: _getChats
};
