const mongoose = require("./database");
const resources = require("../../resource/constant");
const chatMessageSchema = require("../schema/chatMessageSchema");

const resourcesConnection = resources.connections;

let chatMessageModel;

async function connect() {
    chatMessageModel = await mongoose.model(
        resourcesConnection.chatMessageCollection,
        chatMessageSchema
    );
}

connect();

async function _createMessage(chatId, senderName, message) {
    return await chatMessageModel.create({_senderName: senderName, _message: message, _chatId: chatId})
}

module.exports = {
    createMessage: _createMessage,
};
