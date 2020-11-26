let offerDatabase = require("../interfaces/database/offerDatabase");
let ressources = require("../ressources/constant");
const statusService = require("./statusService");

async function _offerList(req, res) {
  const offerlist = await offerDatabase.offerList();
  if (offerlist.length <= 0) {
    return statusService.createFailResponse(res,req,403,ressources.responseMsg.EmptyRessource);
  }

  req.data.offerList = offerlist;
  return;
}
async function _addOffer(req, res) {
  if (req.body.offer) {
    const requestOffer = req.body.offer;

    const newOffer = await offerDatabase.addOffer(requestOffer.name,requestOffer.description,requestOffer.price,requestOffer.size,requestOffer.brand,requestOffer.condition,req.user.username);
    if(!newOffer){
      return statusService.createFailResponse(res,req,400,ressources.responseMsg.default);
    }
    return;

  } else {
    return statusService.createFailResponse(res,req,401,ressources.responseMsg.EmptyRessource);
  }
}

module.exports = { offerList: _offerList, addOffer: _addOffer };
