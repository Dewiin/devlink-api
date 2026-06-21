import { Router } from "express";
import { chatController } from "../controllers/chatController";

// middleware
import { verifyAuth } from "../middleware/verifyAuth";
import { messageValidator } from "../middleware/messageValidator";

export const chatRouter = Router();

chatRouter.get("/", chatController.getGlobalChat);
chatRouter.post("/", verifyAuth, messageValidator.validateMessage, chatController.postGlobalChat);

