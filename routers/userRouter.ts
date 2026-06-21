import { Router } from "express";
import { userController } from "../controllers/userController";

// middleware
import { verifyAuth } from "../middleware/verifyAuth";

export const userRouter = Router();

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:userId', userController.getUserById);
userRouter.get('/chats', verifyAuth, userController.getUserChats);
