import { Router, Request, Response } from "express";
import { loginValidators, registerValidators } from "../validators/inputValidation";
import { body, Result, ValidationError, validationResult } from "express-validator";
import jwt, {JwtPayload} from "jsonwebtoken"
import bcrypt from "bcrypt"
import {User, IUser} from "../models/User";


const userRouter: Router = Router()

userRouter.post("/register",
    registerValidators,
    async(req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req);


        //Return only the first validation error from each field instead of whole list.
        if(!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({
                errors: errors.array({
                    onlyFirstError: true
                })
            });
        }

        try {
            const existingUser: IUser | null = await User.findOne({email: req.body.email})

            //Format error message to be used in the email helpertext field in Register.tsx
            if (existingUser) {
                return res.status(403).json({
                    errors: [
                        {
                            path: "email",
                            msg: "Email is already in use"
                        }
                    ]
                });
            }

            const salt: string = bcrypt.genSaltSync(10);
            const hash: string = bcrypt.hashSync(req.body.password, salt);

            const newUser: IUser = new User({
                email: req.body.email,
                username: req.body.username,
                password: hash
            });

            await newUser.save()

            return res.status(200).json({message: "Registeration successful"})


        } catch (error: any) {
            console.log(error);
            res.status(500).json({message: "Internal server error"});
        }
    }
    
)

userRouter.post("/login",
    loginValidators,
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req);


        if(!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({
                errors: errors.array({
                    onlyFirstError: true
                })
            });
        }

        try {
            const user: IUser | null = await User.findOne({email: req.body.email})

            if(!user) {
                return res.status(404).json({
                    errors: [{
                        path: "email",
                        msg: "User with your email does not exist"
                    }]
                });
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {

                //Save user _id to payload to retrieve associated drive documents from database later
                const jwtPayload: JwtPayload = {
                    _id: user._id
                }

                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, {expiresIn: "45m"});

                return res.status(200).json({"success": true, "token": token, "username": user.username})
            } else {
                return res.status(401).json({
                    errors: [{
                        path: "password",
                        msg: "Wrong password"
                    }]
                });
            }
            
        } catch (error: any) {
            console.log(error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
)

export default userRouter;