// Import Dependencies
const nodemailer = require("nodemailer");

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
    from :'mondaldipu904@gmail.com',
    to : options.email,
    subject: options.subject,
    html : `${options.body}`,
  };

  return transporter.sendMail(mailCredentials);
};

// /*
//  * User email verification
//  */
// const emailVerification = (otpToken, email) => {
//   transporter.sendMail({
//     from: "Mobilfixes",
//     subject: "Email account Verification.",
//     to: email,
//     html: `Hello, 
//     Here is Your Otp ${otpToken}.
//     Do not share it with anyone.
//   `,
//   });
// };
// /*
//  *  Order status update report
//  */
// const orderReport = (status, email) => {
//   transporter.sendMail({
//     from: "Mobilfixes",
//     subject: "Order Report",
//     to: email,
//     html: `Your order has ${status}. `,
//   });
// };

// /*
//  *  Send a url with reset paswword token to confirm right user
//  */
// const mailToUserForPasswordReset = (token, email) => {
//   transporter.sendMail({
//     from: '"node app " <mondaldipu904@gmail.com>',
//     subject: "Node app",
//     text: "Hello world",
//     to: email,
//     html: `
//        <h3>Password Reset!</h3>
//        <p>Make sure, you want to change your password?</p>
//         <a href="http://localhost:5000/user/reset/${token}">Click Here</a>
//          `,
//   });
// };
// /*
//  *  Mail to the booking customer
//  */
// const mailToUserForBooking = (email) => {
//   transporter.sendMail({
//     from: '"node app " <mondaldipu904@gmail.com>',
//     subject: "Node app",
//     text: "Hello world",
//     to: email,
//     html: `
//        <h3>Booking Successfull .</h3>
//        <p>We will Serving you as soon as possible.</p>
//         `,
//   });
// };

// /*
//  *  mail to the shop Admin while someone booked something
//  */
// const mailToShopAdminForBooking = (email) => {
//   transporter.sendMail({
//     from: '"node app " <mondaldipu904@gmail.com>',
//     subject: "Node app",
//     text: "Hello world",
//     to: email,
//     html: `
//        <h3>Someone has book something.</h3>
//         `,
//   });
// };
// /*
//  *  mail to the Super Admin while someone booked something
//  */
// const mailToSuperAdminForBooking = () => {
//   transporter.sendMail({
//     from: '"node app " <mondaldipu904@gmail.com>',
//     subject: "Node app",
//     text: "Hello world",
//     to: "alex@gmail.com",
//     html: `
//        <h3>Someone has book something.</h3>
//         `,
//   });
// };

// module.exports = { transmitEmail };
