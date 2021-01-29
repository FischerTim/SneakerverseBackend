const mongoose = require("./database");
const resources = require("../Util/resource/constant");
const chatMessageSchema = require("../Model/chatMessageSchema");

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
    const date = new Date(Date.now())
    let d = date.getDay()
    d = d.toString().length === 1 ? "0" + d.toString() : d.toString()
    let m = date.getMonth() + 1
    m = m.toString().length === 1 ? "0" + m.toString() : m.toString()
    let y = date.getFullYear()
    y= y.toString()[2]+y.toString()[3]
    let lh = date.getHours()
    let tm = date.getMinutes()
    return await chatMessageModel.create({_senderName: senderName, _created: [d, m, y].join(".") + " " + [lh, tm].join(":"), _message: message, _chatId: chatId})
}

module.exports = {
    createMessage: _createMessage,
};
