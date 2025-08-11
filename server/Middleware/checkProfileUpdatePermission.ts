import { NextFunction, Request, Response } from "express";

export const Manager = (req: Request, res: Response, next: NextFunction) => {
    if (req.User.Role === "Manager") {
        return next();
    }
    return res.status(403).json({ message: "You don't have permission." })
}


export const TeamLeader = (req: Request, res: Response, next: NextFunction) => {
    if (req.User.Role === "TeamLeader") {
        return next();
    }
    return res.status(403).json({ message: "You don't have permission." })
}


export const Employee = (req: Request, res: Response, next: NextFunction) => {

    if (req.User.Role === "Employee") {
        return next();
    }
    return res.status(403).json({ message: "You don't have permission." })
}