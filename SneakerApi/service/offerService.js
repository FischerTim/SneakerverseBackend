const offerDatabase = require("../database/interface/offerDatabase");
const resources = require("../resource/constant");

const statusCode = resources.statusCode
const responseMsg = resources.responseMsg


let service = ""

function get() {
    if (service) {
        return service
    } else {
        service = new offerService()
        return service
    }
}

class offerService {
    async offerList(req, res) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        const offers = await offerDatabase.offerList();
        if (offers.length <= 0) {

            req.data.offerlist = {};
            return;
        }

        req.data.offerlist = offers;
        return;
    }

    async offerWithIdExits(id) {
        return await offerDatabase.offerWithId(id) ? true : false
    }


    async addOffer(req, res) {
        const userService = req.userService;
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }

        if (!req.body.offer) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.offer = req.body.offer
        const newOffer = await offerDatabase.addOffer(req.offer.name, req.offer.description, req.offer.price, req.offer.size, req.offer.brand, req.offer.condition, req.user.username, req.offer.address);

        if (!newOffer) {
            return requestService.createFailResponse(res, req, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }
        await userService.addOfferId(req.user.username, newOffer._id)

        return;
    }

    async deleteOffer(req, res) {
        const userService = req.userService;
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.id) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        const newOffer = await offerDatabase.offerWithId(req.body.id)
        if (!newOffer) {
            return requestService.createFailResponse(res, req, statusCode.NOT_FOUND, responseMsg.OFFER_NOT_FOUND);
        }
        if (newOffer._ownerName != req.user.username) {
            return requestService.createFailResponse(res, req, statusCode.FORBIDDEN, responseMsg.NO_PERMISSIONS);
        }
        await offerDatabase.deleteOfferWithId(req.body.id);
        await userService.removeOfferId(req.user.username, req.body.id);
        return
    }
}

module.exports = get
