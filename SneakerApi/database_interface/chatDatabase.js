const mongoose = require("./database");
const ressources = require("../Util/resource/constant");
const chatSchema = require("../Model/chatSchema");

const ressourcesConnection = ressources.connections;

let chatModel;

async function connect() {
    chatModel = await mongoose.model(
        ressourcesConnection.chatCollection,
        chatSchema
    );
}

connect();

async function _chatList() {
    return await chatModel.find();
}

async function _createChat(id1, id2) {
    return chatModel.create({_subscriber: [id1, id2]});
}

async function _chatWithSubscriberExists(id1, id2) {

    if (await chatModel.findOne({_subscriber: [id1, id2]})) {
        return true
    }
    if (!await chatModel.findOne({_subscriber: [id2, id1]})) {
        return false
    }
    return true;
}

async function _chat(id) {
    return await chatModel.findById(id)
}

async function _insertChatMessage(message) {
    const chat = await _chat(message._chatId)
    chat._messages.push(message)
    await chatModel.updateOne({_id: message._chatId}, {_messages: chat._messages})
}

async function _chatMessages(id) {
    return (await _chat(id))._messages;
}

module.exports = {
    chatList: _chatList,
    createChat: _createChat,
    chatWithSubscriberExists: _chatWithSubscriberExists,
    chat: _chat,
    insertChatMessage: _insertChatMessage,
    chatMessages: _chatMessages
};
