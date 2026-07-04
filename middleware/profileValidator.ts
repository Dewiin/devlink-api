import { body } from "express-validator";

const validateProfile = [
    body("displayName")
    .trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Display name must be between 1 to 50 characters.`),
    body("bio")
    .trim()
    .isLength({ max: 500 }).withMessage(`Bio has a limit of 500 characters.`)
]

export const profileValidator = {
    validateProfile
}
