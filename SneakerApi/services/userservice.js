let userDatabase = require("../interfaces/database/userDatabase");
let ressources = require("../ressources/constant");

async function _login(req, res) {
  if (req.body.user) {
    const requestUser = req.body.user;

    const matchlist = await userDatabase.getUserWithUsername(
      requestUser.username
    );

    if (matchlist.length <= 0) {
      // Unauthorized
      res.status(401);
      req.errorDescription = ressources.responseMsg.unauthorized;
      return;
    }

    const dBUser = await matchlist[0].toObject();
    if (
      requestUser.username == dBUser._username &&
      requestUser.password == dBUser._password
    ) {
      req.user = { username: dBUser._username, role: dBUser._role };
      return;
    } else {
      // Unauthorized
      res.status(401);
      req.errorDescription = ressources.responseMsg.unauthorized;
      return;
    }
  } else {
    // Unauthorized
    res.status(401);
    req.errorDescription = ressources.responseMsg.userBodyMissig;
    return;
  }
}
async function _registation(req, res) {
  if (req.body.user) {
    const requestUser = req.body.user;
    const matchlist = await userDatabase.getUserWithUsername(
      requestUser.username
    );
    if (matchlist.length > 0) {
      // Already Exits
      res.status(403);
      req.errorDescription = ressources.responseMsg.userNameAlreadyUsed;
      return;
    }
    await userDatabase.registerUser(requestUser.username, requestUser.password);

    return await _login(req, res);
  } else {
    // Unauthorized
    res.status(401);
    req.errorDescription = ressources.responseMsg.userBodyMissig;
    return;
  }
}

module.exports = { login: _login, registation: _registation };
