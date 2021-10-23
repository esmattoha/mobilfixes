// Import Dependecies
const jwt = require("jsonwebtoken");

// Make a JWT token to Authentication
const signAccessToken = async (email, userId) => {
  return jwt.sign(
    {
      email: email,
      id: userId,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "30s",
    }
  );
};

/**
 *
 * @param {*} email
 * @param {*} userId
 * @returns token
 */
const signRefreshToken = async (email, userId) => {
  return jwt.sign(
    {
      email: email,
      id: userId,
    },
    process.env.REFRESHTOKEN_SECRET_KEY,
    {
      expiresIn: "5m",
    }
  );
};

//export
module.exports = { signAccessToken, signRefreshToken };
