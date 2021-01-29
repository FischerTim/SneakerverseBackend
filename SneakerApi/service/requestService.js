const resources = require("../Util/resource/constant");
let service = ""

function get() {
    if (service) {
        return service
    } else {
        service = new requestService()
        return service
    }
}

class requestService {

    responseFail(res, req, next, status, message) {
        res.status(status);
        const result = {};
        result.errorDescription = message
            ? message
            : resources.responseMsg.default;
        res.json(result);
    }

    sendData(req, res, next) {
        const result = {};
        result.accessToken = req.accessToken ? req.accessToken : {};
        result.data = req.data ? req.data : {};
        res.json(result);
    }
}

module.exports = get
