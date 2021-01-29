const jwt = require("jsonwebtoken");
const accessTokenSecret = "youraccesstokensecret";
let userDatabase = require("../database_interface/userDatabase");
let resources = require("../Util/resource/constant");
const statusCode = resources.statusCode
const responseMsg = resources.responseMsg
const Logger = require('../Util/Util').Logger
let service = ""

function get() {
    if (service) {
        return service
    } else {
        service = new userService()
        return service
    }
}

class userService {
    registration = async (req, res, next) => {
        const requestService = req.requestService;
        if (!req.body.user) {
            return requestService.responseFail(res, req, next, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        const requestUser = req.body.user;
        const databaseUser = await userDatabase.getUserWithUsername(requestUser.username);
        if (databaseUser) {
            // Already Exits
            return requestService.responseFail(res, req, next, statusCode.CONFLICT, responseMsg.USERNAME_USED);
        }

        await userDatabase.registerUser(requestUser.username, requestUser.password);
        await this.login(req, res, next);

    }

    login = async (req, res, next) => {
        const requestService = req.requestService;
        if (!req.body.user) {
            return requestService.responseFail(res, req, next, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }

        const requestUser = req.body.user;
        let databaseUser = await userDatabase.getUserWithUsername(requestUser.username);

        if (!databaseUser) {
            // Unauthorized
            return requestService.responseFail(res, req, next, statusCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
        }

        databaseUser = await databaseUser.toObject();
        if (
            requestUser.username != databaseUser._username ||
            requestUser.password != databaseUser._password
        ) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        const userToken = jwt.sign({
            username: databaseUser._username,
            role: databaseUser._role,
            id: databaseUser._id
        }, accessTokenSecret)
        await userDatabase.updateUserToken(databaseUser._username, userToken)
        req.accessToken = userToken
        req.user = {username: databaseUser._username, role: databaseUser._role, id: databaseUser._id};
        next()
    }

    logout = async (req, res, next) => {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        await userDatabase.updateUserToken(req.user.username, "")
        delete req.accessToken
        next()
    }

    async authorizedRequest(req, res, next) {
        const requestService = req.requestService;
        const authHeader = req.headers.authorization;
        if (!authHeader) {

            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.MISSING_AUTHORIZATION_HEADER);
        }
        const token = authHeader.split(" ")[1];
        let user

        try {
            user = await jwt.verify(token, accessTokenSecret)
        } catch (e) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.INVALID_TOKEN);
        }
        Logger.debug("Pre Database access in AuthorizedRequest(UserService)")
        let databaseUser = await userDatabase.getUserWithUsername(user.username);
        Logger.debug("post Database access in AuthorizedRequest(UserService)")
        if (!databaseUser) {
            return requestService.responseFail(res, req, next, statusCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
        }

        databaseUser = await databaseUser.toObject();
        if (databaseUser._sessionToken != token) {
            Logger.debug(databaseUser._sessionToken)
            Logger.debug(token)
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.INVALID_TOKEN);
        }
        req.user = user;
        req.accessToken = token;
        Logger.debug("Pre end in AuthorizedRequest(UserService)")
        next()
    }

    async authorizedRequestNew(req, res, next) {
        const requestService = req.requestService;
        const authHeader = req.headers.authorization;
        if (!authHeader) {

            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.MISSING_AUTHORIZATION_HEADER);
        }
        const token = authHeader.split(" ")[1];
        let user

        try {
            user = await jwt.verify(token, accessTokenSecret)
        } catch (e) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.INVALID_TOKEN);
        }
        Logger.debug("Pre Database access in AuthorizedRequest(UserService)")
        let databaseUser = await userDatabase.getUserWithUsername(user.username);
        Logger.debug("post Database access in AuthorizedRequest(UserService)")
        if (!databaseUser) {
            return requestService.responseFail(res, req, next, statusCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);

        }

        databaseUser = await databaseUser.toObject();
        if (databaseUser._sessionToken != token) {
            Logger.debug(databaseUser._sessionToken)
            Logger.debug(token)
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.INVALID_TOKEN);
        }
        req.user = user;
        req.accessToken = token;
        Logger.debug("Pre end in AuthorizedRequest(UserService)")
        next()
    }

    async getProfile(req, res, next) {
        const requestService = req.requestService;
        Logger.debug("getProfile Request Body: ", req.body)
        Logger.debug("GetProfile Request headers: ", req.headers)
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.username) {
            Logger.debug("GetProfile / Body not correct need: username got: ", req.body.username)
            return requestService.responseFail(res, req, next, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.username = req.body.username
        try {
            const userProfile = await userDatabase.getUserWithUsername(req.username)
            req.data.userProfile = userProfile
            next()
        } catch (e) {
            Logger.debug(e);
            return requestService.responseFail(res, req, next, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }
    }

    async addOfferId(username, id) {
        await userDatabase.addOfferId(username, id)
    }

    async addChatId(username, id) {
        await userDatabase.addChatId(username, id)
    }

    async getUserById(id) {
        if (!await userDatabase.idExist(id)) {
            return ""
        }
        return await userDatabase.getUserWithId(id)
    }

    async removeOfferId(username, id) {
        await userDatabase.removeOfferId(username, id)
    }

    async addFavoriteId(req, res, next) {
        const requestService = req.requestService;
        const offerService = req.offerService;
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.id) {
            return requestService.responseFail(res, req, next, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.id = req.body.id

        if (!await offerService.offerWithIdExits(req.id)) {
            return requestService.responseFail(res, req, next, statusCode.NOT_FOUND, responseMsg.OFFER_NOT_FOUND);
        }

        await userDatabase.addFavoriteId(req.user.username, req.id)
        next()
    }

    async removeFavoriteId(req, res, next) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.id) {
            return requestService.responseFail(res, req, next, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.id = req.body.id

        await userDatabase.removeFavoriteId(req.user.username, req.id)
        next()
    }

    async getFavoritesId(req, res, next) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.responseFail(res, req, next, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        req.data.favorites = await userDatabase.getFavoriteId(req.user.username)
        next()
    }

    async getChatList(id) {
        return await userDatabase.getChats(id);
    }

}

module.exports = get
