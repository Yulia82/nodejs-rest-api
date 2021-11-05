const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const {SENDER_API_KEY} = process.env;

sgMail.setApiKey(SENDER_API_KEY);

const sendEmail = async (data) => {
    const email = {...data, from: "caribywest@gmail.com"}
    await sgMail.send(email);
    console.log(`письмо отправлено${email.to}`)
};

module.exports = sendEmail;