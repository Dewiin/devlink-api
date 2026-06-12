import { prisma } from "../config/prismaClient";
import { body } from "express-validator";

const emailValidator = body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email address.")

const passwordValidator = body("password")
    .isLength({min: 8, max: 512})
    .withMessage(`Password must be between 8 to 512 characters.`)
    .matches(/^[\P{Cc}\P{Cn}\P{Cs}]+$/gu)
    .withMessage(`Password can only contain printable characters.`)

const validateSignup = [
    body("displayName")
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Display name must be between 1 to 50 characters.`),

    emailValidator
    .custom(async (value) => {
        const user = await prisma.user.findUnique({
            where: { email: value }
        });
        if(user) throw new Error("E-mail already in use!")
    }),

    passwordValidator
]

const validateLogin = [
    emailValidator,

    passwordValidator
]

export const authValidator = {
    validateSignup,
    validateLogin,
}
