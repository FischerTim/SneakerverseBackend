let socketIo = ""
const resource = require('../resource/constant')
const session = require("express-session");
const logger = require('../Util/Util').Logger

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
        logger.debug("User Connected")
        const session = socket.request.session;
        session.connections++;
        session.save();

        socket.on(resource.chat.joinEvent, function (room) {
            socket.join(room);
            logger.debug("user joined the room: "+room)
        });
        socket.on(resource.chat.leaveEvent, function (room) {
            socket.leave(room);
            logger.debug("user left the room: "+room)
        });

    });
    socketIo.sendToRoom = (roomId, message) => {
        logger.debug("user send message: "+message +" to roomid:" +roomId)
        socketIo.to(roomId).emit(resource.chat.updatePrefix + roomId, message)
    }
    return socketIo

}

module.exports = get
