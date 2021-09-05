const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const extractToken = require("../utils/extractToken");
const { validateToken } = require("../utils/validateToken");

//Middleware to check authticity of user
const isLoggedIn = catchAsync(async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).send({ message: "Unauthorized Request" });
  }

  const userId = await validateToken(token);

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized Request" });
  }

  const user = await User.findById(userId);

  if (!user || user.blockedAt) {
    return next(
      new AppError(`Account not exist or the account is terminated.`, 204)
    );
  }
  // req.userId = user._id;
  req.user = user;
  next();
});

module.exports = { isLoggedIn };
