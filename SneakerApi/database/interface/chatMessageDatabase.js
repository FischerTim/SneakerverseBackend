const mongoose = require("./database");
const ressources = require("../../resource/constant");
const chatMessageSchema = require("../schema/chatMessageSchema");

const ressourcesConnection = ressources.connections;

let chatMessageModel;

async function connect() {
    chatMessageModel = await mongoose.model(
        ressourcesConnection.chatMessageCollection,
        chatMessageSchema
    );
}

connect();


async function _existsById(id) {
    return await chatModel.findById(id) ? true : false
}

async function _createMessage(chatId, senderName, message) {
    return await chatMessageModel.create({_senderName: senderName, _message: message, _chatId: chatId})
}

module.exports = {
    existsById: _existsById,
    createMessage: _createMessage,
};
