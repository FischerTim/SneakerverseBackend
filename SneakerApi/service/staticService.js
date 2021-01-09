const chatDatabase = require("../database/interface/chatDatabase");
const chatMessageDatabase = require("../database/interface/chatMessageDatabase");
const userDatabase = require("../database/interface/userDatabase");
const resources = require("../resource/constant");
const Logger = require('../Util/Util').Logger
const staticResource = require("../resource/staticResource")
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
    async blog(req, res) {
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        return req.data.blog = staticResource.blog;
    }

    async releaseCalendar(req, res) {
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        return req.data.releaseCalendar = staticResource.releaseCalendar;
    }
}

module.exports = get
