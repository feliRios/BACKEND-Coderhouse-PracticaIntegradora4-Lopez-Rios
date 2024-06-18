const { Router } = require("express")
const { ChatView } = require( "../controllers/chat.controllers")


const chatRouter = Router()

chatRouter.get('/', ChatView)

module.exports = chatRouter
