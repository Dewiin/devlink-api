import passport from "passport"
import { Router } from "express";
import { authController } from "../controllers/authController";

// middleware
import { authValidator } from "../middleware/authValidator";
import { validateRequest } from "../middleware/validateRequest";
import { verifyAuth } from "../middleware/verifyAuth";

export const authRouter = Router();

authRouter.get("/me", verifyAuth, authController.getCurrentUser);
authRouter.get("/refresh", authController.refresh);

// local auth
authRouter.post(
    "/signup",
    authValidator.validateSignup, 
    validateRequest, 
    authController.signup
);
authRouter.post(
    "/login", 
    authValidator.validateLogin, 
    validateRequest, 
    passport.authenticate("local", {
        session: false,
        failureRedirect: process.env.CLIENT_URL,
    }),
    authController.login
);
authRouter.get(
    "/logout",
    authController.logout
);

// google oauth
authRouter.get(
    "/google", 
    passport.authenticate("google", { 
        session: false,
        prompt: "select_account" 
    })
);
authRouter.get(
    "/google/callback", 
    passport.authenticate("google", { 
        session: false,
        failureRedirect: process.env.CLIENT_URL
    }),
    authController.oauthLogin
);

// github oauth
authRouter.get(
    "/github",
    passport.authenticate("github", {
        session: false,
    })
);
authRouter.get(
    "/github/callback", 
    passport.authenticate("github", {
        session: false,
        failureRedirect: process.env.CLIENT_URL
    }),
    authController.oauthLogin
)