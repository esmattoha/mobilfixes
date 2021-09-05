const Cancelation = require("../models/cancelationRequestesModel.js");
const Booking = require("../models/orderModel.js");
const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");

/*
 *  Track of Order cancelation
 */
exports.store = catchAsync( async (req, res, next) => {
  const { order, reason} = req.body;
  const user = req.user ;

  if(!order ||  !reason || !user){
    return next(new AppError("Invalid data Input", 406));
  }

  const bookingCancelation = new Cancelation({
    order: order,
    user: user._id ,
    reason: reason,
  });

  const createdResource = await bookingCancelation.save();
  if (!createdResource) {
    return next(new AppError(`Something went wrong try again later`, 411));
  }

  res.status(201).json("Resource Created!");
});

/*
 * User's Cancelations
 */
exports.showUserCancelations = catchAsync(async (req, res, next) => {
  const  user  = req.user ;
  
  if(!user){
    return next(new AppError("Invalid data Input", 406));
  }

  const Resources = await Cancelation.find({ user: user._id });
  if (!Resources) {
    return next(new AppError(`Resource not found`, 404));
  }

   res.status(201).json(Resources);
});
/*
 * Canselations
 */
exports.index = catchAsync(async (req, res, next) => {
  const Resources = await Cancelation.find();
  if (Resources.length <= 0) {
    return next(new AppError(`Resource not found`, 404));
  }

  res.status(201).json(Resources);
});

/*
 * update Cancelation
 */
exports.update = catchAsync(async (req, res, next) => {
  const { cancelation } = req.body;
  if (!cancelation) {
    return next(new AppError("Invalid data Input", 403));
  }
  // Approve Time set , when Admin approve the user request
  const approvalTime = {
    $set: {
      confirmedAt: new Date(),
    },
  };

  const updatedResource = await Cancelation.findByIdAndUpdate(
    cancelation,
    approvalTime
  );
  if (!updatedResource) {
    return next(new AppError(`Resource not found`, 404));
  }

  // Order Deleted , when the user cancelled order approve by the admin
  const updatedOrder = await Booking.findByIdAndUpdate(
    updatedResource.order,
    { $set: { status: "cancelled" } }
  );
  if (!updatedOrder) {
    return next(new AppError(`Order not found`, 404));
  }
  await Cancelation.findByIdAndDelete(cancelation);
  res.status(200).json("Order cancelled.");
});

/*
 *  Delete cancelation
 */
exports.delete = catchAsync(async (req, res, next) => {
  const { cancelation } = req.body;
  if (!cancelation) {
    return next(new AppError("Invalid cancelation id", 403));
  }

  const deletedResource = await Cancelation.findByIdAndDelete(cancelation);
  if (!deletedResource) {
    return next(new AppError(`Resource not found`, 404));
  }
  res.status(200).json("Resource Deleted !");
});
