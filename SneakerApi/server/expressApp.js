const express = require('express');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const resource = require('../resource/constant')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const expressApp = express();

expressApp.use(cors())
expressApp.use(logger('dev'));
expressApp.use(express.json());
expressApp.use(express.urlencoded({extended: false}));
expressApp.use(cookieParser());
expressApp.use(express.static(path.join(__dirname, 'public')));
expressApp.use((req, res, next) => {
    req.data = {}
    next()
})
expressApp.set('port', resource.server.port);

function start() {
    const swaggerDocument = YAML.load('./documentation/openApi3.0.yaml');
    const baseRouter = require('../router/base');

    expressApp.use(resource.paths.base, baseRouter);
    expressApp.use(resource.paths.docu, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = {app: expressApp, start};
