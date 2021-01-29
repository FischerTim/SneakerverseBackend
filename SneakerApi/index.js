#!/usr/bin/env node

const resource = require('./Util/resource/constant');
const logger = require('./Util/Util').Logger

const expressApp = require('./server/expressApp');
const httpServer = require('./server/httpServer')(expressApp.app);

require('./service/webSocketService')(httpServer);

expressApp.start()

httpServer.listen(resource.server.port, () => {
    logger.info(`Server launched on Port: ${resource.server.port} 🚀`)
    logger.debug("Server is running in debug mode")
    logger.dev("Server is running in dev mode")
});