import { Router } from "express";
import { userController } from "../controllers/userController";
import multer from "multer"

// middleware
import { verifyAuth } from "../middleware/verifyAuth";
import { profileValidator } from "../middleware/profileValidator";
import { validateRequest } from "../middleware/validateRequest";

export const userRouter = Router();
const upload = multer({dest: "uploads/"})

userRouter.get('/', userController.getAllUsers);
userRouter.get('/chats', verifyAuth, userController.getUserConversations);
userRouter.get('/search', userController.searchUserByName);
userRouter.get('/:userId', userController.getUserById);
userRouter.put('/me/avatar', verifyAuth, upload.single("avatar"), userController.updateUserAvatar);
userRouter.put('/me/banner', verifyAuth, upload.single("banner"), userController.updateUserBanner);
userRouter.put('/me', profileValidator.validateProfile, validateRequest, verifyAuth, userController.updateUserProfile);

