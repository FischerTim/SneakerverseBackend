let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let resource = require('../resource/constant')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

let expressApp = express();

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
    let baseRouter = require('../router/base');

    expressApp.use(resource.paths.base, baseRouter);
    expressApp.use(resource.paths.docu, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

module.exports = {app: expressApp, start};
