import { Router } from "express";
import { chatController } from "../controllers/chatController";

// middleware
import { messageValidator } from "../middleware/messageValidator";

export const chatRouter = Router();

chatRouter.get("/", chatController.getGlobalChat);
chatRouter.post("/", messageValidator.validateMessage, chatController.postGlobalChat);

