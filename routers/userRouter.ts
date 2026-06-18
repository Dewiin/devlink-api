import { Router } from "express";
import { userController } from "../controllers/userController";

export const userRouter = Router();

userRouter.get('/', userController.getAllUsers);