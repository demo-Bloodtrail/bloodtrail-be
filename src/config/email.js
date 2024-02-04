import nodemailer from "nodemailer";

export const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODE_MAILER_ID,
        pass: process.env.NODE_MAILER_PWD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});