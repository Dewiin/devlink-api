import { body } from "express-validator";

const validateMessage = 
    body("content")
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage(`Display name must be between 1 to 50 characters.`)


export const messageValidator = {
    validateMessage,
}