import { Router } from "express";
import { authController } from "../controllers/authController";

// middleware
import { authValidator } from "../middleware/authValidator";
import { validateRequest } from "../middleware/validateRequest";

export const authRouter = Router();

authRouter.post("/signup", authValidator.validateSignup, validateRequest, authController.signup);
authRouter.post("/login", authValidator.validateLogin, validateRequest, authController.login);
authRouter.get("/logout", authController.logout);