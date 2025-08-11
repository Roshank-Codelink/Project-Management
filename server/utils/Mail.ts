const nodemailer = require("nodemailer");
require("dotenv").config();

export async function SendMail(Email: string, MainHTMlTemplate: string, Subject: string) {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.Service,
            auth: {
                user: process.env.CompnayEmail,
                pass: process.env.EmailPassword,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.CompnayEmail,
            to: Email,
            subject: Subject,
            html: MainHTMlTemplate,
        });
    } catch (error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }
}



