const ratingDatabase = require("../database/interface/ratingDatabase");
const resources = require("../resource/constant");
let userDatabase = require("../database/interface/userDatabase");
const statusCode = resources.statusCode
const responseMsg = resources.responseMsg


let service = ""

function get() {
    if (service) {
        return service
    } else {
        service = new ratingService()
        return service
    }
}

class ratingService {
    async getRating(req, res) {
        const requestService = req.requestService;

        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.ratingId) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.ratingId = req.body.ratingId
        try {

            const rating = await ratingDatabase.getRatingWithId(req.ratingId)
            req.data.rating = rating
            return
        } catch (e) {
            return requestService.createFailResponse(res, req, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }
    }


    async addRating(req, res) {
        const requestService = req.requestService;
        const userService = req.userService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }

        if (!req.body.rating) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.rating = req.body.rating

        try {

            const rating = await ratingDatabase.createRate(req.rating.targetUsername, req.rating.rating, req.user.username)
            await userDatabase.addRatingId(rating._targetUsername, rating._id)

            req.data.rating = rating
            return
        } catch (e) {
            return requestService.createFailResponse(res, req, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }

    }

}

module.exports = get
