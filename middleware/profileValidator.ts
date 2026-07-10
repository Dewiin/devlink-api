import { body } from "express-validator";

const validateProfile = [
    body("displayName")
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Display name must be between 1 to 50 characters.`),
    body("bio")
    .trim()
    .isLength({ max: 500 }).withMessage(`Bio has a limit of 500 characters.`)
]

const validatePassword = [
    body("oldPassword")
    .isString(),
    body("newPassword")
    .isLength({min: 8, max: 512})
    .withMessage(`Password must be between 8 to 512 characters.`)
    .matches(/^[\P{Cc}\P{Cn}\P{Cs}]+$/gu)
    .withMessage(`Password can only contain printable characters.`)
]

export const profileValidator = {
    validateProfile,
    validatePassword
}
