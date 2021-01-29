const ratingDatabase = require("../database_interface/ratingDatabase");
const resources = require("../Util/resource/constant");
let userDatabase = require("../database_interface/userDatabase");
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
    async getRatingsWithIds(req, res, next) {
        const requestService = req.requestService;

        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.ids) {
            return requestService.responseFail(res, req, next, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.ratingId = req.body.ratingId
        try {
            const result = []
            for (let id in req.body.ids) {
                if(! await ratingDatabase.ratingWithIdExist(req.user.username, req.body.ids[id])){

                    return requestService.responseFail(res, req, next, statusCode.BAD_SYNTAX, responseMsg.ID_NOT_FOUND);
                }
                result.push(await ratingDatabase.getRatingWithId(req.body.ids[id]))
            }
            req.data.ratings = result
            next()
        } catch (e) {
            Logger.debug(e)
            return requestService.responseFail(res, req, next, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }
    }

    async addRating(req, res, next) {
        const requestService = req.requestService;
        const userService = req.userService;
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }

        if (!req.body.rating) {
            return requestService.responseFail(res, req, next, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.rating = req.body.rating

        try {

            const rating = await ratingDatabase.createRate(req.rating.targetUsername, req.rating.rating, req.user.username, req.rating.message)
            await userDatabase.addRatingId(rating._targetUsername, rating._id)

            req.data.rating = rating
            next()
        } catch (e) {
            Logger.debug(e)
            return requestService.responseFail(res, req, next, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }

    }

}

module.exports = get
