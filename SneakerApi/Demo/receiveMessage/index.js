#!/usr/bin/env node

class ChatServer {
    constructor(endpoint,updateprefix) {
        this._endpoint=endpoint
        this._socketIOClient = require("socket.io-client");
        this._updateprefix= updateprefix
    }
    start() {
        const socket = this._socketIOClient(this._endpoint, {transports: ["websocket"]});
        socket.emit('join', '5fcb4c6615a1db0bd2abcec1');
        socket.on(this._updateprefix + "5fcb4c6615a1db0bd2abcec1", function (data) {
            console.log(data)
        });
    }

}
const ENDPOINT = "ws://localhost:3000";
const UPDATEPREFIX = "update"

const server = new ChatServer(ENDPOINT,UPDATEPREFIX);
server.start();
