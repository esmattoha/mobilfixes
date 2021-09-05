/*
 * Title: "Phone Repairing"
 * Description: "Repair your phone with your current location!"
 * Author: Dipu Mondal(me)
 * Date: 28.03.2021
 */

// Import Dependencies
const env = require("dotenv");
//Reseters .env by default
env.config();
//IMPORTING app instamce
const app = require("./app");

// Port define
const PORT = process.env.PORT || 5000;

// Port Listening
app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});
