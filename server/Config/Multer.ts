const multer = require('multer')
import { Request } from "express";
import fs from "fs"

const storage: any = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: any) {

        const Foldername = "./Images";
        const ProjectFolder = `${Foldername}/Project`;
        const UserFolder = `${Foldername}/User`;
        if (!fs.existsSync(Foldername)) {
            fs.mkdirSync(Foldername);
        }
        if (file.fieldname === "Attachments") {
            if (!fs.existsSync(ProjectFolder)) {
                fs.mkdirSync(ProjectFolder);
            }
            cb(null, ProjectFolder)
        } else {
            if (file.fieldname === "ProfileImageUrl") {
                if (!fs.existsSync(UserFolder)) {
                    fs.mkdirSync(UserFolder);
                }
                cb(null, UserFolder)
            }
        }
    },
    filename: function (req: any, file: any, cb: any) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

export const upload = multer({ storage: storage })