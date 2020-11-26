let offerDatabase = require("../interfaces/database/offerDatabase");
let resources = require("../resources/constant");
const requestService = require("./requestService");
const userService = require("../services/userService");
const statusCode = resources.statusCode
const responseMsg = resources.responseMsg

async function _offerList(req, res) {
  if( ! req.user){
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


async function _addOffer(req, res) {
  if(!req.user){
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
  }

  if (!req.body.offer) {
    return requestService.createFailResponse(res,req,statusCode.BAD_SYNTAX,responseMsg.INVALID_BODY);
  }

  const requestOffer = req.body.offer;

  const newOffer = await offerDatabase.addOffer(requestOffer.name,requestOffer.description,requestOffer.price,requestOffer.size,requestOffer.brand,requestOffer.condition,req.user.username);
  if(!newOffer){
    return requestService.createFailResponse(res,req,statusCode.UNKNOWN,responseMsg.DATABASE_CREATION_FAILED);
  }
  await userService.addOfferId(req.user.username, newOffer._id)

  return;
}

async function _deleteOffer(req, res){
  if(!req.user){
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
  }
  if (!req.body.id) {
    return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
  }
  const newOffer = await offerDatabase.offerWithId(req.body.id)
  if(!newOffer){
    return requestService.createFailResponse(res, req, statusCode.NOT_FOUND, responseMsg.OFFER_NOT_FOUND);
  }
  if(newOffer._ownerName != req.user.username){
    return requestService.createFailResponse(res, req, statusCode.FORBIDDEN, responseMsg.NO_PERMISSIONS);
  }
  await offerDatabase.deleteOfferWithId(req.body.id);
  await userService.removeOfferId(req.user.username, req.body.id);
  return
}

module.exports = {
  offerList: _offerList,
  addOffer: _addOffer,
  deleteOffer:_deleteOffer
};
