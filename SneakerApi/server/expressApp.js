const express = require('express');
const path = require('path');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const resource = require('../Util/resource/constant')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const myLogger = require('../Util/Util').Logger
const expressApp = express();

expressApp.use(cors())
expressApp.use(logger('dev'));
expressApp.use(express.json());
expressApp.use(express.urlencoded({extended: false}));
expressApp.use(cookieParser());

expressApp.use((req, res, next) => {
    req.data = {}
    next()
})
expressApp.use((req, res, next) => {
    if(!req.body){
        res.status(400).send("Body missing")
    }
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
