let offerDatabase = require("../interfaces/database/offerDatabase");
let ressources = require("../ressources/constant");

async function _offerList(req, res) {
  const offerlist = await offerDatabase.offerList();
  if (offerlist.length <= 0) {
    res.status(403);
    req.errorDescription = ressources.responseMsg.EmptyRessource;
    return;
  }

  const _data = req.data ? req.data : {};
  _data.offerList = offerlist;
  console.log(_data);
  req.data = _data;
  return;
}
async function _addOffer(req, res) {
  if (req.body.offer) {
    const requestOffer = req.body.offer;

    await offerDatabase.addOffer(requestOffer.name);
    return await _offerList(req, res);
  } else {
    // Unauthorized
    res.status(401);
    req.errorDescription = ressources.responseMsg.EmptyRessource;
    return;
  }
}

module.exports = { offerList: _offerList, addOffer: _addOffer };
