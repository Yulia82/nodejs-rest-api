const nodemailer = require("nodemailer");
require("dotenv").config();

const {EMAIL_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "yu_go@meta.ua",
        pass: EMAIL_PASSWORD,
    },
//     tls: {
//         rejectUnauthorized: false
//     }
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
    const email = {
        ...data, 
        from: "yu_go@meta.ua",
    }
    await transporter.sendMail(email);
    console.log('email send')
};

module.exports = sendEmail;