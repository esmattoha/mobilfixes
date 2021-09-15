const { validateRefreshToken } = require("../utils/validateToken");
const {
  signAccessToken,
  signRefreshToken,
} = require("../utils/jwtTokenHelper");
const User = require("../models/userModel");

exports.tokenRegenarate = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json("Invalid Data Input");
  }

  const userId = await validateRefreshToken(refreshToken);

  const user = await User.findById(userId).select("_id email");
  if (!user) {
    return res.status(404).json("user not found.");
  }

  const newAccessToken = await signAccessToken(user.email, user._id);
  const newRefreshToken = await signRefreshToken(user.email, user._id);

  res.status(201).json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
};
