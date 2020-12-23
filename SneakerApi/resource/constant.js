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
    chatCollection: "chat",
    chatMessageCollection: "chatmessage",
    cityCollection: "city",
    ratingCollection: "rating",
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
    USER_NOT_FOUND: "No user with this data found",
    AUTHORIZATION_FAILED: "Authorization failed",
    DATABASE_REQUEST_FAILED: "database failed accessing resource",
    OFFER_NOT_FOUND: "Can't find resource",
    NO_PERMISSIONS: "You are not permit to use that resource",
    DUPLICATE_SUBSCRIBERS_CHAT: "Users already chatted"
};

const _paths = {
    offer: "/offer",
    user: "/user",
    docu: "/docu",
    favorite: "/favorite",
    chat: "/chat",
    base: "/",
    profile:"/profile",
    rating:"/rating"
}
const _server = {
    port: 3000
}
const _chat = {
    joinEvent: "join",
    leaveEvent: "exit",
    updatePrefix: "update",
    connectionEvent: "connection"
}
module.exports = {
    credentials: _credentials,
    connections: _connections,
    responseMsg: _responseMsg,
    statusCode: _statusCode,
    paths: _paths,
    server: _server,
    chat: _chat
};
