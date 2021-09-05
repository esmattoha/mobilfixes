/**
 * @param String token
 * @return String userId || boolean
 */

const jwt = require("jsonwebtoken");

const validateToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return false;
    }
    return decoded.id;
  });
};

/**
 *
 * @param {*} token
 * @returns userId
 */
const validateRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.REFRESHTOKEN_SECRET_KEY,
    (error, decoded) => {
      if (error) {
        return false;
      }
      return decoded.id;
    }
  );
};

//export
module.exports = { validateToken, validateRefreshToken };
