// Import Dependencies
const nodemailer = require("nodemailer");

/*
 *  Makeing a Transporter to sending mail
 */
const sendEmail = async (options) => {
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

  console.log(options.email);
  
  const mailCredentials = {
    from: "mondaldipu904@gmail.com",
    to: options.email,
    subject: options.subject,
    html: `${options.html}`,
  };

  return transporter.sendMail(mailCredentials);
};


// export
module.exports = { sendEmail };
