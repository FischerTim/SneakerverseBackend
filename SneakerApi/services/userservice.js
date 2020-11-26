const jwt = require("jsonwebtoken");
const accessTokenSecret = "youraccesstokensecret";
let userDatabase = require("../interfaces/database/userDatabase");
let ressources = require("../ressources/constant");
let requestService = require("./requestService")

async function _registation(req, res) {
  if (req.body.user) {
    return requestService.createFailResponse(res,req,401,ressources.responseMsg.userBodyMissig);
  }
  const requestUser = req.body.user;
  const matchlist = await userDatabase.getUserWithUsername(
      requestUser.username
  );

  if (matchlist.length > 0) {
    // Already Exits
    return requestService.createFailResponse(res,req,403,ressources.responseMsg.userNameAlreadyUsed);
  }

  await userDatabase.registerUser(requestUser.username, requestUser.password);
  return await _login(req, res);

}

async function _login(req, res) {
  if ( ! req.body.user) {
    return requestService.createFailResponse(res,req,401,ressources.responseMsg.userBodyMissig);
  }

  const requestUser = req.body.user;
  const matchlist = await userDatabase.getUserWithUsername(
      requestUser.username
  );

  if (matchlist.length <= 0) {
    // Unauthorized
    return requestService.createFailResponse(res,req,401,ressources.responseMsg.unauthorized);
  }

  const dBUser = await matchlist[0].toObject();
  if (
      requestUser.username != dBUser._username ||
      requestUser.password != dBUser._password
  ) {
    return requestService.createFailResponse(res,req,401,ressources.responseMsg.unauthorized);
  }
  const userToken = jwt.sign({ username: dBUser._username, role: dBUser._role },accessTokenSecret)
  await userDatabase.updateUserToken(dBUser._username, userToken)
  req.accessToken = userToken
  req.user = { username: dBUser._username, role: dBUser._role };
  return;
}

async function _logout(req,res){
  if(!req.user){
    return requestService.createFailResponse(res, req, 401, ressources.responseMsg.unauthorized);
  }
  await userDatabase.updateUserToken(req.user.username, "")
  delete req.accessToken
  return
}

async function _authorizedRequest(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return requestService.createFailResponse(res, req, 401, ressources.responseMsg.invalidHeader);
  }

  const token = authHeader.split(" ")[1];
  let user

  try{
    user = await jwt.verify(token, accessTokenSecret)
  }catch (e) {
    return requestService.createFailResponse(res, req, 401, ressources.responseMsg.invalidToken);
  }

  const matchlist = await userDatabase.getUserWithUsername(user.username);

  if (matchlist.length <= 0) {
    // Unauthorized
    return requestService.createFailResponse(res, req, 401, ressources.responseMsg.unauthorized);
  }

  const dBUser = await matchlist[0].toObject();
  if (dBUser._sessionToken != token) {
    return requestService.createFailResponse(res, req, 401, ressources.responseMsg.unauthorized);
  }
  req.user = user;
  req.accessToken = token;
  return;
}

module.exports = { login: _login, registation: _registation ,logout:_logout,authorizedRequest:_authorizedRequest};
