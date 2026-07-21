import {body} from "express-validator";

const registerValidators = [
    body("email")
    .trim()
    .isEmail()
    .withMessage("Invalid Email")
    .bail()
    .normalizeEmail()
    .escape(),
    body("password").isStrongPassword({
        minLength: 8,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("Password should be minimum 8 characters, include 1 symbol, 1 number, upper and lowercase characters"),
    body("username").trim().escape().isLength({max: 25})
    .withMessage("Max length for username is 25 characters")

]

const loginValidators = [
    body("email").trim().isEmail().normalizeEmail().escape(),
    body("password").notEmpty()
]

const addEditorValidators = [
    body("email").trim().isEmail().withMessage("Invalid Email").normalizeEmail().escape(),
]

export {loginValidators, registerValidators, addEditorValidators}