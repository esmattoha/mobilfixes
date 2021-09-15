/**
 * OTP Generator
 **/

// Generate OTP
const generate = (counter = 6) => {
  let otp = "";
  for (let i = 0; i < counter; i++) {
    otp += String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }
  return otp.toUpperCase();
};

module.exports = { generate };
