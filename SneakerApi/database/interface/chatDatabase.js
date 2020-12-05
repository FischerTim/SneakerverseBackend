const mongoose = require("./database");
const ressources = require("../../resource/constant");
const chatSchema = require("../schema/chatSchema");

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

    if(await chatModel.findOne({_subscriber: [id1, id2]})){
        return true
    }
    if(!await chatModel.findOne({_subscriber: [id2, id1]})){
        return false
    }
    return true;
}
async function _chat(id){
    return await chatModel.findById(id)
}

module.exports = {
    chatList: _chatList,
    createChat: _createChat,
    chatWithSubscriberExists: _chatWithSubscriberExists,
    chat:_chat
};
