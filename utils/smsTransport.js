// Import dependencies
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

/**
 * 
 * @param {*} phone 
 * @param {*} status 
 */
const orderUpdate = ( phone,status) =>{
 client.messages
  .create({
     body: `Your order has ${status}.`,
     from: '+19786307041',
     to: phone
   })
};

/**
 * 
 * @param {*} phone 
 */
const createdOrder = ( phone) =>{
    client.messages
  .create({
     body: `Your have ordered succesfully.`,
     from: '+19786307041',
     to: phone
   })
}
// exports
module.exports = { orderUpdate , createdOrder };


