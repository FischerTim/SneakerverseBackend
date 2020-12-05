const resources = require("../resource/constant");
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

    requestFailed(res) {
        const statusCode = res.statusCode;
        if (statusCode >= 200 && statusCode < 300) {
            return false;
        }

        return true;

    }

    createFailResponse(res, req, status, message) {
        res.status(status);
        req.errorDescription = message;
    }

    async runEachFunctionAsPipeline(req, res, functions) {

        for (let index = 0; index < functions.length; ++index) {
            const job = functions[index]
            await job(req, res)

            if (this.requestFailed(res)) {
                return this._sendError(req, res);
            }
        }
        this._sendData(req, res);
    }

    _sendData(req, res) {
        const result = {};
        result.accessToken = req.accessToken ? req.accessToken : {};
        result.data = req.data ? req.data : {};
        res.json(result);
    }

    _sendError(req, res) {

        const result = {};
        result.errorDescription = req.errorDescription
            ? req.errorDescription
            : resources.responseMsg.default;
        res.json(result);
    }
}

module.exports = get
