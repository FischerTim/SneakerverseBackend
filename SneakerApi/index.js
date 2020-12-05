#!/usr/bin/env node

const resource = require('./resource/constant');

const expressApp = require('./server/expressApp');
const httpServer = require('./server/httpServer')(expressApp.app);

const socketIo = require('./service/webSocketService')(httpServer);

expressApp.start()

httpServer.listen(resource.server.port, () => {
    console.log(`Server launched on Port: ${resource.server.port} 🚀`)
});