let socketIo = ""
const resource = require('../resource/constant')
const session = require("express-session");

function get(server) {
    if (socketIo) {
        return socketIo
    }
    if (!server) {
        throw new Error()
    }
    const sessionMiddleware = session({
        secret: "keyboard cat",
        cookie: { maxAge: 60000 },
    });

    socketIo = require("socket.io")(server);
    socketIo.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });
    socketIo.on(resource.chat.connectionEvent, async function (socket) {
        const session = socket.request.session;
        session.connections++;
        session.save();

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
