const Cancelation = require("../models/cancelationRequestesModel.js");
const Booking = require("../models/orderModel.js");
const AppError = require("./../utils/appError");
const catchAsync = require("../utils/catchAsync");
const errorMessages = require("../resources/errorMessages");

/*
 *  Track of Order cancelation
 */
exports.store = catchAsync( async (req, res, next) => {
  const { order, reason} = req.body;
  const user = req.user ;

  if(!order ||  !reason || !user){
    return next(new AppError("Invalid data Input", 406));
  }

  const bookingCancelation = await Cancelation.create({
    order: order,
    user: user._id ,
    reason: reason,
  });

  if (!bookingCancelation) {
    return next(new AppError(errorMessages.GENERAL, 406));
  }

  res.status(201).json({
    status : "success",
    message : "Resource Created!"
  });
});

/*
 * User's Cancelations
 */
exports.showUserCancelations = catchAsync(async (req, res, next) => {
  const  user  = req.user ;
  
  if(!user){
    return next(new AppError("Invalid data Input", 406));
  }

  const resources = await Cancelation.find({ user: user._id });

  if (!resources) {
    return next(new AppError(`Resource not found`, 404));
  }

   res.status(201).json({
     status : "success",
     data : resources
   });
});

/*
 * Canselations
 */
exports.index = catchAsync(async (req, res, next) => {
  const resources = await Cancelation.find();

  if (resources.length <= 0) {
    return next(new AppError(`Resource not found`, 404));
  }

  res.status(201).json({
    status : "success",
    data : resources
  });
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
  res.status(200).json({
    status : "success",
    message : "Update Successful"
  });
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

  res.status(200).json({
    status : "success",
    message : "Resource Deleted !"
  });
});
