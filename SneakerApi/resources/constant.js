const _credentials = {
  MongoDBUser: {
    Username: "admin",
    Password: "tefK1CgrHYasdasdMVLqG",
  },
  TestUser: {
    Username: "TestUser",
    Password: "TestPassword",
  },
};
const _connections = {
  database: "main",
  userCollection: "user",
  sessionCollection: "session",
  offerCollection: "offer",
  constInConnectionUrl: {
    USERNAME: "<USERNAME>",
    PASSWORD: "<PASSWORD>",
    DATABASE: "<DATABASE>",
  },
  connectionUrl:
    "mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.57rjy.mongodb.net/<DATABASE>?retryWrites=true&w=majority",
};
const _statusCode = {
  BAD_REQUEST: 400,
  BAD_SYNTAX: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNKNOWN: 500

}
const _responseMsg = {
  BASE: "Something went wrong. Please try it again",
  INVALID_BODY: "You body was not correct",
  INVALID_TOKEN: "The token you send in the header was wrong",
  MISSING_AUTHORIZATION_HEADER: "you need a authorization header",
  USERNAME_USED: "This username is already used",
  USER_NOT_FOUND: "No user with this username found",
  AUTHORIZATION_FAILED: "Authorization failed",
  DATABASE_CREATION_FAILED: "database failed to create ressource",
  OFFER_NOT_FOUND: "Can't find ressource",
  NO_PERMISSIONS: "You are not permit to use that ressource",
};

module.exports = {
  credentials: _credentials,
  connections: _connections,
  responseMsg: _responseMsg,
  statusCode: _statusCode
};
