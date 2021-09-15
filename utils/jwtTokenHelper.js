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
      expiresIn: "10h",
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
      expiresIn: process.env.REFRESHTOKEN_LIFESPAN,
    }
  );
};

//export
module.exports = { signAccessToken, signRefreshToken };
