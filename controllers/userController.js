// Import Dependencis
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const { signAccessToken } = require("../utils/jwtTokenHelper");
const errorMessages = require("../resources/errorMessages");
const successMessages = require("../resources/successMessages");
const optGenerator = require("../utils/otpGenerator");
const { sendEmail } = require("../utils/email");
 
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
  if (!hashPassword) {
    return;
  }

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const encryptedVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  const mobileNumber = "+1" + phone;
   

  const user = await User.create({
    name,
    email,
    phone: mobileNumber,
    password: hashPassword,
    verification_token: encryptedVerificationToken,
    verification_expire_at: Date.now() + 2 * 60 * 1000,
  });

  if (!user) {
    return next(new AppError(errorMessages.GENERAL, 406));
  }
  await sendEmail({
    email : user.email,
    subject : "Registration",
    html : 
    ` <h1>Welcome to Mobilfixes , ${user.name}</h1>
      <p><a href="http://localhost:5000/user/email-verification/${verificationToken}">click here</a> & verify your email.</p>
    `
  })
  res.status(200).json("A Verification code has been sent to your email");
  
});

/**
 *  Email Validation of New User
 */
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new AppError("Invalid data Input", 406));
  }
  const encryptedVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // find User
  const user = await User.findOne({
    verification_token: encryptedVerificationToken,
    verification_expire_at: { $gte: Date.now() },
  });

  if (!user) {
    return res.status(200).json("Request from Unknown Resource.");
  }

  user.verification_token = undefined;
  user.verification_expire_at = undefined;

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
exports.delete = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    return next(new AppError("Invalid data Input", 406));
  }

  await User.findByIdAndDelete(id);
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
  const {
    long,
    lat,
    addressLine1,
    addressLine2,
    city,
    state,
    zipcode,
  } = req.body;

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
  const {
    long,
    lat,
    addressLine1,
    addressLine2,
    city,
    state,
    zipcode,
  } = req.body;

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

  const verificationToken = crypto.randomBytes(32).toString('hex');
  const encryptedVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  user.reset_token = encryptedVerificationToken;
  user.reset_expire_at = Date.now() + 2 * 60 * 1000;

  await sendEmail({
    email : user.email,
    subject : "Password Reset",
    html : 
    ` <h1>Password Reset</h1>
      <p><a href="http://localhost:5000/user/reset/${verificationToken}">click here</a></p>
    `
  })
  await user.save();
  res.status(200).json({
    message: "Please enter the verification code been sent to your email",
  });
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

  const encryptedVerificationToken = crypto
    .createHash('sha256')
    .update(buffer)
    .digest('hex');

  const user = await User.findOne({
    reset_token: encryptedVerificationToken,
    reset_expire_at: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError(errorMessages.TOKEN_EXPIRED, 404));
  }
  // Password encryption
  const hash = await bcrypt.hash(password, 12);

  user.password = hash;
  user.reset_token = undefined;
  user.reset_expire_at = undefined;
  
  await user.save();
  res.status(200).json({ message: successMessages.RESOURCE_UPDATED });
});
