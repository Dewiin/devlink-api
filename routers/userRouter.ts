import { Router } from "express";
import { userController } from "../controllers/userController";

// middleware
import { verifyAuth } from "../middleware/verifyAuth";

export const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/chats', verifyAuth, userController.getUserConversations);
userRouter.get('/search', userController.searchUserByName);
userRouter.get('/:userId', userController.getUserById);
