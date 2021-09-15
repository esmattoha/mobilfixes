// Import dependencies
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

/**
 *
 * @param {*} phone
 * @param {*} status
 */
 const sendMessage = async (options) => {
   client.messages.create({
     body: `${options.body}`,
     from: "+19786307041",
     to: options.phone,
   });
 };

 // export
 module.exports = { sendMessage } ;


