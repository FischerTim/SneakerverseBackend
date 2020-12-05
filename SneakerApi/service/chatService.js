let chatDatabase = require("../database/interface/chatDatabase");
let resources = require("../resource/constant");


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

        const secondUser = await userService.getUserById(req.body.subscriber)

        if (!secondUser) {
            return requestService.createFailResponse(res, req, statusCode.NOT_FOUND, responseMsg.USER_NOT_FOUND);
        }

        if (await chatDatabase.chatWithSubscriberExists(req.user.id, req.body.subscriber)) {
            return requestService.createFailResponse(res, req, statusCode.CONFLICT, responseMsg.DUPLICATE_SUBSCRIBERS_CHAT);
        }

        const newChat = await chatDatabase.createChat(req.user.id, req.body.subscriber)

        if (!newChat) {
            return requestService.createFailResponse(res, req, statusCode.UNKNOWN, responseMsg.DATABASE_CREATION_FAILED);
        }

        await userService.addChatId(req.user.username, newChat._id)
        await userService.addChatId(secondUser._username, newChat._id)
        return;
    }
    async chatListOfUser(req, res){
        const userService = req.userService;
        const requestService = req.requestService;
        if (!req.user) {
            return requestService.createFailResponse(res, req, statusCode.UNAUTHORIZED, responseMsg.AUTHORIZATION_FAILED);
        }
        const chatIds = await userService.getChatList(req.user.id)
        const list = []
        for(let id in await chatIds){
            list.push(await chatDatabase.chat(chatIds[id]));
        }
        req.data.chatList = list.reverse()
    }

}

module.exports = get
