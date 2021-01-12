const chatDatabase = require("../database/interface/chatDatabase");
const chatMessageDatabase = require("../database/interface/chatMessageDatabase");
const userDatabase = require("../database/interface/userDatabase");
const resources = require("../resource/constant");
const Logger = require('../Util/Util').Logger

const statusCode = resources.statusCode
const responseMsg = resources.responseMsg


let service = ""

function get() {
    if (service) {
        return service
    } else {
        service = new chatService()
        return service
    }
}

class chatService {

    async addChat(req, res) {
        const userService = req.userService;
        const requestService = req.requestService;

        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }

        if (!req.body.subscriber) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.subscriber = req.body.subscriber

        const secondUser = await userService.getUserById(req.subscriber)

        if (!secondUser) {
            return requestService.createFailResponse(res, req, statusCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
        }

        if (await chatDatabase.chatWithSubscriberExists(req.user.id, req.subscriber)) {
            return requestService.createFailResponse(res, req, statusCode.CONFLICT, responseMsg.DUPLICATE_SUBSCRIBERS_CHAT);
        }

        const newChat = await chatDatabase.createChat(req.user.id, req.subscriber)

        if (!newChat) {
            return requestService.createFailResponse(res, req, statusCode.UNKNOWN, responseMsg.DATABASE_REQUEST_FAILED);
        }

        await userService.addChatId(req.user.username, newChat._id)
        await userService.addChatId(secondUser._username, newChat._id)
        return;
    }

    async chatListOfUser(req, res) {
        const userService = req.userService;
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        const chatIds = await userService.getChatList(req.user.id)
        const list = []
        for (let id in await chatIds) {
            const chat = await chatDatabase.chat(chatIds[id])
            let subscriberAsName = []
            const sup = (await chat)._subscriber
            for (let userId in await sup) {
                subscriberAsName.push(await userDatabase.getUsername(chat._subscriber[userId]))
            }
            chat._subscriber = subscriberAsName
            list.push(chat);
        }

        req.data.chatList = list.reverse()
    }

    async chatsWithIds(req, res) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.ids) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        const result = []
        for (let id in req.body.ids) {
            if(! await userDatabase.chatsOfUserContainsId(req.user.username, req.body.ids[id])){

                return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.ID_NOT_FOUND);
            }
            const chat = await chatDatabase.chat(req.body.ids[id])
            let subscriberAsName = []
            const sup = (await chat)._subscriber
            for (let userId in await sup) {
                subscriberAsName.push(await userDatabase.getUsername(chat._subscriber[userId]))
            }
            chat._subscriber = subscriberAsName
            result.push(chat);
        }

        req.data.chats = result
    }

    async addMessage(req, res) {
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        if (!req.body.chatId || !req.body.chatMessage) {
            return requestService.createFailResponse(res, req, statusCode.BAD_SYNTAX, responseMsg.INVALID_BODY);
        }
        req.chatId = req.body.chatId;
        req.chatMessage = req.body.chatMessage

        const chat = await chatDatabase.chat(req.chatId)
        if (!chat._subscriber.includes(req.user.id)) {
            return requestService.createFailResponse(res, req, statusCode.FORBIDDEN, responseMsg.NO_PERMISSIONS);
        }
        Logger.debug(chat)

        const chatMessage = await chatMessageDatabase.createMessage(req.chatId, req.user.username, req.chatMessage)
        Logger.debug(chatMessage)
        await chatDatabase.insertChatMessage(chatMessage)
        const chatMessages = await chatDatabase.chatMessages(req.chatId)
        req.websocketService.sendToRoom(req.chatId, {messages: chatMessages})
    }

}

module.exports = get
