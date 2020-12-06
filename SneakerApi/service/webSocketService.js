let socketIo = ""
const resource = require('../resource/constant')

function get(server) {
    if (socketIo) {
        return socketIo
    }
    if (!server) {
        throw new Error()
    }

    socketIo = require("socket.io")(server);
    socketIo.on(resource.chat.connectionEvent, async function (socket) {
        socket.on(resource.chat.joinEvent, function (room) {
            socket.join(room);
        });
        socket.on(resource.chat.leaveEvent, function (room) {
            socket.leave(room);
        });
    });
    socketIo.sendToRoom = (roomId, message) => {
        socketIo.to(roomId).emit(resource.chat.updatePrefix + roomId, message)
    }
    return socketIo

}

module.exports = get
