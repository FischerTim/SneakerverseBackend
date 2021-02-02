const chatDatabase = require("../database_interface/chatDatabase");
const chatMessageDatabase = require("../database_interface/chatMessageDatabase");
const userDatabase = require("../database_interface/userDatabase");
const resources = require("../Util/resource/constant");
const Logger = require('../Util/Util').Logger
const staticResource = require("../Util/resource/staticResource")
const statusCode = resources.statusCode
const responseMsg = resources.responseMsg


let service = ""

function get() {
    if (service) {
        return service
    } else {
        service = new staticService()
        return service
    }
}

class staticService {
    async blog(req, res, next) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        req.data.blog = staticResource.blog;
        next()
    }

    async releaseCalendar(req, res, next) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        req.data.releaseCalendar = staticResource.releaseCalendar;
        next()
    }
    async releaseCalendarM1(req, res, next) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        req.data.releaseCalendar = staticResource.releaseCalendarM1;
        next()
    }
}

module.exports = get
