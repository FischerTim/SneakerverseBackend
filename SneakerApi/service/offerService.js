const offerDatabase = require("../database/interface/offerDatabase");
const resources = require("../resource/constant");
const userDatabase = require("../database/interface/userDatabase");
const Logger = require('../Util/Util').Logger
const statusCode = resources.statusCode
const responseMsg = resources.responseMsg
var fs = require('fs');
var path = require('path');
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

    async offersWithIds(req, res) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.ids) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        const result = []
        for (let id in req.body.ids) {
            if (!await offerDatabase.offerWithIdExist(req.body.ids[id])) {
                return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.ID_NOT_FOUND);
            }
            const offer = await offerDatabase.offerWithId(req.body.ids[id])
            result.push(offer);
        }

        req.data.offers = result
    }

    async addOffer(req, res) {
        const userService = req.userService;
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        Logger.debug("Add Offer Request Body: ", req.body)
        Logger.debug("Add Offer Request headers: ", req.headers)
        if (!req.body.offer) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.offer = req.body.offer
        req.ownerId = (await userDatabase.getUserWithUsername(req.user.username))._id
        const newOffer = await offerDatabase.addOffer(req.offer.name, req.offer.description, req.offer.price, req.offer.size, req.offer.brand, req.offer.condition, req.user.username, req.offer.city, req.ownerId);

        if (!newOffer) {
            return requestService.createFailResponse(res, req, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }
        await userService.addOfferId(req.user.username, newOffer._id)
        req.data.offerId = newOffer._id
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


    async addImages(req, res) {
        const userService = req.userService;
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.query.offerId) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }

        if (req.fileValidationError) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        if (!req.file) {

            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        let newOffer = await offerDatabase.offerWithId(req.query.offerId)
        if (!newOffer) {
            return requestService.createFailResponse(res, req, statusCode.NOT_FOUND, responseMsg.OFFER_NOT_FOUND);
        }
        if (newOffer._ownerName != req.user.username) {
            return requestService.createFailResponse(res, req, statusCode.FORBIDDEN, responseMsg.NO_PERMISSIONS);
        }
        //Todo this is test code for iamges
        const data = await fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename))
        let obj = {
            _name: req.file.filename,
            _desc: req.file.destination,
            _img: {
                _data: await fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
                _contentType: 'image/jpg'
            }
        }
        await offerDatabase.addImageToOffer(req.query.offerId, obj);

        newOffer = await offerDatabase.offerWithId(req.query.offerId)
        req.data.o = newOffer
        return

    }
}

module.exports = get
