const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const extractToken = require("../utils/extractToken");
const validateToken = require("../utils/validateToken");
const bcrypt = require("bcrypt");

//Middleare to check and register user
const bookingMiddlleware = catchAsync(async (req, res, next) => {
  // 1. Check if the request has userId
  const token = extractToken(req);

  // 2. checked , if the user has signin
  if (!token) {
    const { customerInfo, createAccount } = req.body;

    // 3. Checked ,The Customer wants to Registered or not
    if (!createAccount) {
      return next();
    }
    const findUser = await User.findOne({ email: customerInfo.email });

    // 4. If user exists then assign the user id to req
    // 5. Otherwise Create the user ands assign the user id to req
    let user = findUser ? findUser : null;

    const hashPassword = await bcrypt.hash(customerInfo.password, 12);

    if (!findUser) {
      const userOb = new User({
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        password: hashPassword,
      });
      const createdUser = await userOb.save();
      user = createdUser;
    }

    req.user = user;
    return next();
  }

  // 6. token validation
  const userId = await validateToken(token);

  if (!userId) {
    return res.status(401).send({ message: "Unauthorized Request" });
  }

  const existingUser = await User.findById(userId);

  if (!existingUser) {
    return res.status(401).send({ message: "Unauthorized Request" });
  }

  req.user = existingUser;
  next();
});

module.exports = { bookingMiddlleware };
