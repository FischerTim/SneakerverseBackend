const jwt = require("jsonwebtoken");
const accessTokenSecret = "youraccesstokensecret";
let userDatabase = require("../database/interface/userDatabase");
let resources = require("../resource/constant");
const statusCode = resources.statusCode
const responseMsg = resources.responseMsg

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
    registration = async (req, res) => {
        const requestService = req.requestService;
        if (!req.body.user) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        const requestUser = req.body.user;
        const databaseUser = await userDatabase.getUserWithUsername(requestUser.username);
        if (databaseUser) {
            // Already Exits
            return requestService.createFailResponse(res, req, statusCode.CONFLICT, responseMsg.USERNAME_USED);
        }

        await userDatabase.registerUser(requestUser.username, requestUser.password);
        return await this.login(req, res);

    }

    login = async (req, res) => {
        const requestService = req.requestService;
        if (!req.body.user) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }

        const requestUser = req.body.user;
        let databaseUser = await userDatabase.getUserWithUsername(requestUser.username);

        if (!databaseUser) {
            // Unauthorized
            return requestService.createFailResponse(res, req, statusCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
        }

        databaseUser = await databaseUser.toObject();
        if (
            requestUser.username != databaseUser._username ||
            requestUser.password != databaseUser._password
        ) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        const userToken = jwt.sign({
            username: databaseUser._username,
            role: databaseUser._role,
            id: databaseUser._id
        }, accessTokenSecret)
        await userDatabase.updateUserToken(databaseUser._username, userToken)
        req.accessToken = userToken
        req.user = {username: databaseUser._username, role: databaseUser._role, id: databaseUser._id};
        return;
    }

    logout = async (req, res) => {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        await userDatabase.updateUserToken(req.user.username, "")
        delete req.accessToken
        return
    }

    async authorizedRequest(req, res) {
        const requestService = req.requestService;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.MISSING_AUTHORIZATION_HEADER);
        }

        const token = authHeader.split(" ")[1];
        let user

        try {
            user = await jwt.verify(token, accessTokenSecret)
        } catch (e) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.INVALID_TOKEN);
        }

        let databaseUser = await userDatabase.getUserWithUsername(user.username);

        if (!databaseUser) {
            return requestService.createFailResponse(res, req, statusCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
        }

        databaseUser = await databaseUser.toObject();
        if (databaseUser._sessionToken != token) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.INVALID_TOKEN);
        }
        req.user = user;
        req.accessToken = token;
        return;
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

    async addFavoriteId(req, res) {
        const requestService = req.requestService;
        const offerService = req.offerService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.id) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.id = req.body.id

        if (!await offerService.offerWithIdExits(req.id)) {
            return requestService.createFailResponse(res, req, statusCode.NOT_FOUND, responseMsg.OFFER_NOT_FOUND);
        }

        await userDatabase.addFavoriteId(req.user.username, req.id)
    }

    async removeFavoriteId(req, res) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.id) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.id = req.body.id

        await userDatabase.removeFavoriteId(req.user.username, req.id)
    }

    async getFavoritesId(req, res) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        req.data.favorites = await userDatabase.getFavoriteId(req.user.username)
    }

    async getChatList(id) {
        return await userDatabase.getChats(id);
    }

}

module.exports = get
