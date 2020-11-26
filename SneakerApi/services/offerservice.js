let offerDatabase = require("../interfaces/database/offerDatabase");
let ressources = require("../ressources/constant");

async function _offerList(req, res) {
  const offerlist = await offerDatabase.offerList();
  if (offerlist.length <= 0) {
    res.status(403);
    req.errorDescription = ressources.responseMsg.EmptyRessource;
    return;
  }

  req.data.offerList = offerlist;
  return;
}
async function _addOffer(req, res) {
  if (req.body.offer) {
    const requestOffer = req.body.offer;

    const newOffer = await offerDatabase.addOffer(requestOffer.name,requestOffer.description,requestOffer.price,requestOffer.size,requestOffer.brand,requestOffer.condition,req.user.username);
    if(!newOffer){
      res.status(400);
      req.errorDescription = ressources.responseMsg.default;
      return
    }
    return;

  } else {
    // Unauthorized
    res.status(401);
    req.errorDescription = ressources.responseMsg.EmptyRessource;
    return;
  }
}

module.exports = { offerList: _offerList, addOffer: _addOffer };
