// Import Dependencies
const Repair = require("../models/repairModel");
const Device = require("../models/deviceModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { errorMessages } = require("./../resources/errorMessages");
const mongoose = require("mongoose");

/*
 *   Store Repair
 */
exports.store = catchAsync(async (req, res, next) => {
  const { title, price, device, image, services } = req.body;

  if (!title || !price) {
    return next(new AppError(`Invalid Input Data.`, 406));
  }

  const repair = await Repair.create({ title, price, device, services, image });

  if (!repair) {
    return next(new AppError(errorMessages.GENERAL, 406));
  }

  res.status(201).json({
    status: "success",
    data: repair,
  });
});

/*
 *   Fetch All Repair
 */
exports.index = catchAsync(async (req, res, next) => {
  const repairs = await Repair.find({});

  if (repairs.length <= 0) {
    return next(new AppError(`No Repair There!.`, 404));
  }

  res.status(200).json({
    status: "success",
    data: repairs,
  });
});
/*
 *   Fetch Repair
 */
exports.show = catchAsync(async (req, res, next) => {
  const { repairId } = req.params;

  if (!repairId) {
    return next(new AppError("Invalid data Input", 406));
  }

  const repair = await Repair.findById(repairId);

  if (!repair) {
    return next(new AppError(`Repair not found.`, 404));
  }

  res.status(200).json({
    status: "success",
    data: repair,
  });
});

/*
 *   Update Repair
 */
exports.update = catchAsync(async (req, res, next) => {
  const { repairId } = req.params;
  const { title, price, services, image } = req.body;

  if (!title || !image || !price || !services) {
    return next(new AppError("Invalid data Input", 406));
  }

  const repair = await Repair.findByIdAndUpdate(repairId, {
    $set: {
      title,
      price,
      services,
      image,
    },
  });

  if (!repair) {
    return next(new AppError(`Repair not found.`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Resource Update successfull.",
  });
});

/*
 *   Choose Device to find Repairs
 */
exports.findRepairs = catchAsync(async (req, res, next) => {
  const { device } = req.params;
  const { service } = req.query;

  if (!device || !service) {
    return next(new AppError("Invalid data Input", 406));
  }

  const deviceInfo = await Device.findById(device);
  if (!deviceInfo) {
    return next(new AppError("Resource Not Found.", 404));
  }

  const query = { device: mongoose.Types.ObjectId(device) };

  if (service) {
    query.services = service;
  }

  const repairs = await Repair.find(query);

  if (repairs.length <= 0) {
    return next(new AppError(`No Repair available for this device.`, 404));
  }
  res.json({ data: { device: deviceInfo, repairs } });
});

/*
 *   Delete Repair
 */
exports.delete = catchAsync(async (req, res, next) => {
  const repairId = req.params.repairId;

  if (!repairId) {
    return next(new AppError("Invalid data Input", 406));
  }

  const repair = await Repair.findById(repairId);

  if (!repair) {
    return next(new AppError(`Repair not found.`, 404));
  }

  await repair.delete();
  res.status(200).json({ 
    status: "success",
    message: "Deleted." 
  });
});
