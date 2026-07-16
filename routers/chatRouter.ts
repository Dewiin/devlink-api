import { Router } from "express";
import { chatController } from "../controllers/chatController.js";

// middleware
import { verifyAuth } from "../middleware/verifyAuth.js";
import { messageValidator } from "../middleware/messageValidator.js";

export const chatRouter = Router();

chatRouter.get("/", chatController.getGlobalChat);
chatRouter.post("/", verifyAuth, messageValidator.validateMessage, chatController.postGlobalChat);
chatRouter.get("/:recipientId", verifyAuth, chatController.getChatByRecipientId);
chatRouter.post("/:conversationId", verifyAuth, messageValidator.validateMessage, chatController.postChatByRecipientId);

