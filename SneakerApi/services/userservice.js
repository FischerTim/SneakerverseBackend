let userDatabase = require("../interfaces/database/userDatabase");
let ressources = require("../ressources/constant");
let statusService = require("./statusService")
async function _login(req, res) {
  if (req.body.user) {
    const requestUser = req.body.user;

    const matchlist = await userDatabase.getUserWithUsername(
      requestUser.username
    );

    if (matchlist.length <= 0) {
      // Unauthorized
      return statusService.createFailResponse(res,req,401,ressources.responseMsg.unauthorized);
    }

    const dBUser = await matchlist[0].toObject();
    if (
      requestUser.username == dBUser._username &&
      requestUser.password == dBUser._password
    ) {
      req.user = { username: dBUser._username, role: dBUser._role };
      return;
    } else {
      return statusService.createFailResponse(res,req,401,ressources.responseMsg.unauthorized);
    }
  } else {
    return statusService.createFailResponse(res,req,401,ressources.responseMsg.userBodyMissig);
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
      return statusService.createFailResponse(res,req,403,ressources.responseMsg.userNameAlreadyUsed);
      return;
    }
    await userDatabase.registerUser(requestUser.username, requestUser.password);

    return await _login(req, res);
  } else {
    // Unauthorized
    return statusService.createFailResponse(res,req,401,ressources.responseMsg.userBodyMissig);
  }
}

module.exports = { login: _login, registation: _registation };
