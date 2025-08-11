import { NextFunction, Request, Response, Express } from "express";
import { User } from "../TypeScipt/UserInterfaceType";


const jwt = require('jsonwebtoken');
require("dotenv").config();

declare global {
    namespace Express {
        interface Request {
            User: User
        }
    }
}

export async function Auth(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.cookies.Access_Token;
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        if (!decoded) {
            return res.status(403).json({
                message: "Not Authorized"
            })
        }
        let { Userdata } = decoded;
        req.User = Userdata;
        next();
    } catch (error: any) {
        return res.status(401).json({ message: error.message });
    }
};