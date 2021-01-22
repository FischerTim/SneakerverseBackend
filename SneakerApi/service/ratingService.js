const ratingDatabase = require("../database/interface/ratingDatabase");
const resources = require("../resource/constant");
let userDatabase = require("../database/interface/userDatabase");
const statusCode = resources.statusCode
const responseMsg = resources.responseMsg
Logger = require('../Util/Util').Logger

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
    async getRatingsWithIds(req, res) {
        const requestService = req.requestService;

        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.ids) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.ratingId = req.body.ratingId
        try {
            const result = []
            for (let id in req.body.ids) {
                if(! await ratingDatabase.ratingWithIdExist(req.user.username, req.body.ids[id])){

                    return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.ID_NOT_FOUND);
                }
                result.push(await ratingDatabase.getRatingWithId(req.body.ids[id]))
            }
            req.data.ratings = result
            return
        } catch (e) {
            Logger.debug(e)
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

            const rating = await ratingDatabase.createRate(req.rating.targetUsername, req.rating.rating, req.user.username, req.rating.message)
            await userDatabase.addRatingId(rating._targetUsername, rating._id)

            req.data.rating = rating
            return
        } catch (e) {
            Logger.debug(e)
            return requestService.createFailResponse(res, req, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }

    }

}

module.exports = get
