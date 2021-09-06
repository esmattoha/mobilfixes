// Import Dependencies
const nodemailer = require("nodemailer");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

/*
 *  Makeing a Transporter to sending mail
 */
const transmitEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: { rejectUnauthorized: true },
  });

  const mailCredentials = {
    from: "mondaldipu904@gmail.com",
    to: options.email,
    subject: options.subject,
    html: `${options.html}`,
  };

  return transporter.sendMail(mailCredentials);
};

/**
 *
 * @param {*} phone
 * @param {*} status
 */
const transmitSMS = async (options) => {
  client.messages.create({
    body: `${options.body}`,
    from: "+19786307041",
    to: options.phone,
  });
};

/**
 * 
 * @param {*} options 
 */
const sendMessage = async (options) => {
  if(options.email){
     await transmitEmail(options);
  }
  if (options.phone) {
    await transmitSMS(options);
  }
};

// export
module.exports = { sendMessage };
