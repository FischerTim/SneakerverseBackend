let offerDatabase = require("../interfaces/database/offerDatabase");
let ressources = require("../ressources/constant");
const requestService = require("./requestService");

async function _offerList(req, res) {
  if(!req.user){
    return requestService.createFailResponse(res, req, 401, ressources.responseMsg.unauthorized);
  }
  const offerlist = await offerDatabase.offerList();
  if (offerlist.length <= 0) {
    return requestService.createFailResponse(res,req,403,ressources.responseMsg.EmptyRessource);
  }

  req.data.offerlist = offerlist;
  return;
}
async function _addOffer(req, res) {
  if(!req.user){
    return requestService.createFailResponse(res, req, 401, ressources.responseMsg.unauthorized);
  }

  if (! req.body.offer) {
    return requestService.createFailResponse(res,req,401,ressources.responseMsg.EmptyRessource);
  }

  const requestOffer = req.body.offer;

  const newOffer = await offerDatabase.addOffer(requestOffer.name,requestOffer.description,requestOffer.price,requestOffer.size,requestOffer.brand,requestOffer.condition,req.user.username);
  if(!newOffer){
    return requestService.createFailResponse(res,req,400,ressources.responseMsg.default);
  }
  return;

}
async function _deleteOffer(req,res){
  if(! req.user){
    return requestService.createFailResponse(res, req, 401, ressources.responseMsg.unauthorized);
  }
  if (! req.body.id) {
    return requestService.createFailResponse(res,req,401,ressources.responseMsg.EmptyRessource);
  }
  const newOffer = await offerDatabase.offerWithId(req.body.id)
  if(! newOffer){
    return requestService.createFailResponse(res,req,400,ressources.responseMsg.default);
  }
  if(newOffer._ownerName != req.user.username){
    return requestService.createFailResponse(res,req,400,ressources.responseMsg.default);
  }
  await offerDatabase.deleteOfferWithId(req.body.id);
  return
}

module.exports = { offerList: _offerList, addOffer: _addOffer ,deleteOffer:_deleteOffer};
