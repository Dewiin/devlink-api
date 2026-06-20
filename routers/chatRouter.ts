import { Router } from "express";
import { chatController } from "../controllers/chatController";

export const chatRouter = Router();

chatRouter.get("/", chatController.getGlobalChat);

