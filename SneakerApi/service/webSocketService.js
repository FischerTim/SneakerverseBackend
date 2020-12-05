let socketIo = ""

function get(server) {
    if (socketIo) {
        return socketIo
    }
    if (!server) {
        throw new Error()
    }

    socketIo = require("socket.io")(server);
    socketIo.on("connection", async function (socket) {
        console.log("A client connected to websocket")
    });
    return socketIo

}

module.exports = get
