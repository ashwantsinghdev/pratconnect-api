import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware";
import { fetchChats } from "../controller/chat.controller";


const ChatRouter=Router()

ChatRouter.get("/:to",AuthMiddleware,fetchChats)

export default ChatRouter