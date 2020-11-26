const jwt = require("jsonwebtoken");
const accessTokenSecret = "youraccesstokensecret";
let ressources = require("../ressources/constant");
const statusService = require("./statusService");

function _requestAuthorized(req, res) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (!err) {
        req.user = user;
        req.accessToken = token;
        return;
      }
      return statusService.createFailResponse(res,req,401,ressources.responseMsg.invalidToken);
    });
  } else {
    return statusService.createFailResponse(res,req,401,ressources.responseMsg.invalidHeader);
  }
}

function _addAuthorizationToResponse(req, res) {
  req.accessToken = jwt.sign(
    { username: req.user.username, role: req.user.role },
    accessTokenSecret
  );
}

module.exports = {
  requestAuthorized: _requestAuthorized,
  addAuthorizationToResponse: _addAuthorizationToResponse,
};
