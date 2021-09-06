// Import Dependencis
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { signAccessToken } = require("../utils/tokenImplement");
const errorMessages = require("../resources/errorMessages");
const { sendMessage } = require("../utils/userKnock");
const successMessages = require("../resources/successMessages");

/*
 * Working with User Sign Up Form
 */
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return next(new AppError("Invalid data Input", 406));
  }
  // Password encryption
  const hashPassword = await bcrypt.hash(password, 12);
  // data validation
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error()[0].msg });
  }

  const mobileNumber = "+91" + phone;
  const OTP = Math.floor(Math.random() * 1000000);
  const otpTokenExpiration = Date.now() + 2 * 60 * 1000;

  if (!hashPassword) {
    return;
  }
  const user = await User.create({
    name,
    email,
    phone: mobileNumber,
    password: hashPassword,
    otpToken: OTP,
    otpTokenExpiration: otpTokenExpiration,
  });

  if (!user) {
    return next(new AppError(errorMessages.GENERAL, 406));
  }
  await sendMessage({
    email: email,
    subject: "Email Verification.",
    html: `<h3>Welcome to Mobilfixes , ${name} </h3>, 
         <p>Here is Your Otp ${OTP}.</p>
        <p>Do not share it with anyone.</p>`,
  });
  res.status(200).json("We send a otp on your email for verification.");
});

/**
 *  Email Validation of New User
 */
exports.validateEmail = catchAsync(async (req, res, next) => {
  const { otpToken } = req.body;
  if (!otpToken) {
    return next(new AppError("Invalid data Input", 406));
  }
  // find User
  const user = await User.findOne({
    otpToken: otpToken,
    otpTokenExpiration: { $gte: Date.now() },
  });
  if (!user) {
    return res.status(200).json("Request from Unknown Resource.");
  }

  user.otpToken = undefined;
  user.otpTokenExpiration = undefined;
  await user.save();
  return res.status(200).json("Email has been successfully verified.");
});

/*
 *   Working with User Sign In route
 */
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Invalid data Input", 406));
  }
  // find User
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new AppError(errorMessages.AUTH, 404));
  }
  // If User has blocked
  if (user.blockedAt && user.blockedAt !== null) {
    return next(new AppError(errorMessages.BLOCKED, 404));
  }
  // Password Matching
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new AppError(errorMessages.AUTH, 422));
  }
  // Token generate
  const accessToken = await signAccessToken(email, user._id);
  // const refreshToken = await signRefreshToken(email, user._id);

  res.status(200).json({
    token: accessToken,
    // refreshToken: refreshToken,
    user: {
      _id: user._id,
      userName: user.userName,
      email: user.email,
      type: user.type,
    },
  });
});

/*
 *   Showing All Users
 */

exports.index = catchAsync(async (req, res) => {
  const users = await User.find().limit(100).sort({ _id: -1 });
  if (users.length <= 0) {
    return next(new AppError(errorMessages.RESOURCE_NOT_FOUND, 404));
  }
  res.status(200).json({ data: users });
});

/*
 *   Delete a user
 */
exports.delete = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  if (!userId) {
    return next(new AppError("Invalid data Input", 406));
  }

  await User.findByIdAndDelete(userId);
  res.status(200).json({ message: errorMessages.RESOUCE_DELETED });
});

/*
 *  Authenticated user
 */
exports.me = catchAsync(async (req, res, next) => {
  res.status(200).json(req.user);
});

/*
 *  Update  user
 */
exports.update = catchAsync(async (req, res, next) => {
  const { name, email, phone } = req.body;

  if (!name || !email || !phone) {
    return next(new AppError("Invalid data Input", 406));
  }

  const updateUser = {
    $set: {
      name: name,
      email: email,
      phone: phone,
    },
  };

  const user = await User.findByIdAndUpdate(req.user._id, updateUser);
  if (!user) {
    res.status(404).json("User not found!");
  }
  res.status(200).json("SuccessFull");
});

/*
 *   Add New Address of User
 */
exports.addNewAddress = catchAsync(async (req, res, next) => {
  const customer = req.user;
  const { long, lat, addressLine1, addressLine2, city, state, zipcode } =
    req.body;

  if (!addressLine1 || !addressLine2 || !city || !state || !zipcode) {
    return next(new AppError("Invalid data Input", 406));
  }
  const newAddress = {
    $push: {
      address: {
        long: long,
        lat: lat,
        addressLine1: addressLine1,
        addressLine2: addressLine2,
        city: city,
        state: state,
        zipcode: zipcode,
      },
    },
  };

  // Find User
  if (customer.address.length >= 3) {
    return res.status(200).json({ message: "You can add only 3 addresses." });
  }

  await customer.update(newAddress);

  return res.status(201).json({ message: successMessages.RESOURCE_CREATED });
});

/*
 *   Show Address of User
 */
exports.showAddresses = catchAsync(async (req, res, next) => {
  const customer = req.user;

  const customerAddress = await User.findById(customer._id).select("address");
  return res.status(200).json(customerAddress);
});

/*
 *   User address update
 */
exports.updateAddress = catchAsync(async (req, res, next) => {
  const customer = req.user;
  const { addressId } = req.query;
  const { long, lat, addressLine1, addressLine2, city, state, zipcode } =
    req.body;

  if (
    !addressId ||
    !addressLine1 ||
    !addressLine2 ||
    !city ||
    !state ||
    !zipcode
  ) {
    return next(new AppError("Invalid data Input", 406));
  }

  const updateAddress = {
    $set: {
      "address.$.long": long,
      "address.$.lat": lat,
      "address.$.addressLine1": addressLine1,
      "address.$.addressLine2": addressLine2,
      "address.$.city": city,
      "address.$.state": state,
      "address.$.zipcode": zipcode,
    },
  };

  // Address Update
  await User.findOneAndUpdate(
    {
      _id: customer._id,
      "address._id": addressId,
    },
    updateAddress
  );

  return res.status(200).json({ message: successMessages.RESOURCE_UPDATED });
});

/*
 *  User address Delete route
 */
exports.deleteAddress = catchAsync(async (req, res, next) => {
  const customer = req.user;
  const { addressId } = req.query;

  if (!addressId) {
    return next(new AppError("Invalid data Input", 406));
  }

  // Delete Address
  await User.findByIdAndUpdate(customer._id, {
    $pull: { address: { _id: addressId } },
  });
  res.status(200).json({ message: successMessages.RESOURCE_DELETED });
});

/*
 *   Generate a token for reseting password and send it to user's email
 */
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Invalid data Input", 406));
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError(errorMessages.RESOURCE_NOT_FOUND, 404));
  }

  const buffer = await crypto.randomBytes(32);
  if (!buffer) {
    // Unable to generate token
    return next(new AppError(errorMessages.GENERAL, 403));
  }
  const token = await buffer.toString("hex");

  user.resetToken = token;
  user.resertTokenExpiration = Date.now() + 2 * 60 * 1000;
  await user.save();

  await sendMessage({
    email: email,
    subject: "Password Reset",
    html: `
      <h3>Password Reset!</h3>
      <p>Make sure, you want to change your password?</p>
      <a href="http://localhost:5000/user/reset/${token}">Click Here</a>
      `,
  });

  res
    .status(200)
    .json({ message: "Password reset link has been sent to your email" });
});

/*
 *   Create a new password and update previous one
 */
exports.updatePassword = catchAsync(async (req, res, next) => {
  const buffer = req.params.buffer;
  const password = req.body.password;

  if (!buffer || !password) {
    return next(new AppError("Invalid data Input", 406));
  }

  const user = await User.findOne({
    resetToken: buffer,
    resertTokenExpiration: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError(errorMessages.TOKEN_EXPIRED, 404));
  }
  // Password encryption
  const hash = await bcrypt.hash(password, 12);

  user.password = hash;
  user.resetToken = undefined;
  user.resertTokenExpiration = undefined;
  await user.save();
  res.status(200).json({ message: successMessages.RESOURCE_UPDATED });
});