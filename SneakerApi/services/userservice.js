const jwt = require("jsonwebtoken");
const accessTokenSecret = "youraccesstokensecret";
let userDatabase = require("../interfaces/database/userDatabase");
let resources = require("../resources/constant");
let requestService = require("./requestService")
const statusCode = resources.statusCode
const responseMsg = resources.responseMsg




async function _registration(req, res) {
  if (!req.body.user) {
    return requestService.createFailResponse(res,req,statusCode.BAD_SYNTAX,responseMsg.INVALID_BODY);
  }
  const requestUser = req.body.user;
  const databaseUser = await userDatabase.getUserWithUsername(requestUser.username);
  console.log(databaseUser)
  if (databaseUser) {
    // Already Exits
    return requestService.createFailResponse(res,req,statusCode.CONFLICT,responseMsg.USERNAME_USED);
  }

  await userDatabase.registerUser(requestUser.username, requestUser.password);
  return await _login(req, res);

}

async function _login(req, res) {
  if ( ! req.body.user) {
    return requestService.createFailResponse(res,req,statusCode.BAD_SYNTAX,responseMsg.INVALID_BODY);
  }

  const requestUser = req.body.user;
  let databaseUser = await userDatabase.getUserWithUsername(requestUser.username);

  if (!databaseUser) {
    // Unauthorized
    return requestService.createFailResponse(res,req,statusCode.NOT_FOUND,responseMsg.USER_NOT_FOUND);
  }

  databaseUser = await databaseUser.toObject();
  if (
      requestUser.username != databaseUser._username ||
      requestUser.password != databaseUser._password
  ) {
    return requestService.createFailResponse(res,req,statusCode.UNAUTHORIZED,responseMsg.AUTHORIZATION_FAILED);
  }
  const userToken = jwt.sign({ username: databaseUser._username, role: databaseUser._role },accessTokenSecret)
  await userDatabase.updateUserToken(databaseUser._username, userToken)
  req.accessToken = userToken
  req.user = { username: databaseUser._username, role: databaseUser._role };
  return;
}

async function _logout(req,res){
  if(!req.user){
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
  }
  await userDatabase.updateUserToken(req.user.username, "")
  delete req.accessToken
  return
}

async function _authorizedRequest(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED,responseMsg.MISSING_AUTHORIZATION_HEADER);
  }

  const token = authHeader.split(" ")[1];
  let user

  try{
    user = await jwt.verify(token, accessTokenSecret)
  }catch (e) {
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.INVALID_TOKEN);
  }

  let databaseUser = await userDatabase.getUserWithUsername(user.username);

  if (!databaseUser) {
    return requestService.createFailResponse(res, req, statusCode.NOT_FOUND,responseMsg.USER_NOT_FOUND);
  }

  databaseUser = await databaseUser.toObject();
  if (databaseUser._sessionToken != token) {
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.INVALID_TOKEN);
  }
  req.user = user;
  req.accessToken = token;
  return;
}
async function _addOfferId(username,id) {
  await userDatabase.addOfferId(username, id)
}
async function _removeOfferId(username,id) {
  await userDatabase.removeOfferId(username, id)
}

async function _addFavoriteId(req,res) {
  if(!req.user){
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
  }
  if (!req.body.id) {
    return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
  }

  await userDatabase.addFavoriteId(req.user.username, req.body.id)
}

async function _removeFavoriteId(req,res) {
  if(!req.user){
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
  }
  if (!req.body.id) {
    return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
  }

  await userDatabase.removeFavoriteId(req.user.username, req.body.id)
}

async function _getFavoritesId(req,res) {
  if(!req.user){
    return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
  }
  req.data.favorites = await userDatabase.getFavoriteId(req.user.username)
}




module.exports = {
  removeOfferId:_removeOfferId,
  addOfferId:_addOfferId,
  login: _login,
  registration: _registration,
  logout:_logout,
  authorizedRequest:_authorizedRequest,
  addFavoriteId:_addFavoriteId,
  removeFavoriteId:_removeFavoriteId,
  getFavoritesId:_getFavoritesId

};
