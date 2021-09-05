const Device = require("../models/deviceModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/*
 *  Store Device
 */
exports.store = catchAsync(async (req, res, next) => {
  const { title, parent, image } = req.body;

  if (!title) {
    return next(new AppError(`Fill All Required Fields.`, 400));
  }
  const device = new Device({
    title,
    parent: parent ? parent : null,
    image: image || "",
  });
  const doc = await device.save();
  if (!doc) {
    return next(new AppError(`Server Error!`, 500));
  }
  res.status(201).json({ data: doc });
});

/*
 * Update
 */
exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, image } = req.body;

  if(!title || !image){
    return next(new AppError("Invalid data Input", 406));
  }

  const updateData = {
    title,
    image,
  };
  await Device.findByIdAndUpdate(id, updateData);
  res.status(200).json({ message: "Succesfull!" });
});

/*
 *  Fetch All Device
 */
exports.index = catchAsync(async (req, res, next) => {
  const { parent } = req.query;

  let filter = {};

  if (parent) {
    filter._id = parent;
  } else {
    filter.parent = null;
  }

  const docs = await Device.find(filter).populate({
    path: "children",
  });
  if (docs.length <= 0) {
    return next(new AppError(`No Device There!`, 404));
  }
  res.status(200).json({ data: docs });
});

/*
 *  Fetch Device
 */
exports.show = catchAsync(async (req, res, next) => {
  const { deviceId } = req.params;
  if(!deviceId){
    return next(new AppError("Invalid data Input", 406));
  }

  const device = await Device.findById(deviceId);
  if (!device) {
    return next(new AppError(`Device Not Found.`, 404));
  }
  res.status(200).json({ data: device });
});

/*
 *   Available repair for a paticuler device
 */
exports.findRepairs = catchAsync(async (req, res, next) => {
  const { device } = req.params;
  if(!device){
    return next(new AppError("Invalid data Input", 406));
  }

  const deviceInfo = await Device.findById(device);
  if(!deviceInfo){
    return next(new AppError("Resource Not Found.", 404));
  }

  const repairs = await Repair.find({
    device: mongoose.Types.ObjectId(device),
  });
  if (repairs.length <= 0) {
    return next(new AppError(`No Repair available for this device.`, 404));
  }
  res.json({ data: { device: deviceInfo, repairs } });
});

/*
 *  Delete Device
 */
exports.delete = catchAsync(async (req, res, next) => {
  const { deviceId } = req.params;
  if(!deviceId){
    return next(new AppError("Invalid data Input", 406));
  }

  const device = await Device.findById(deviceId);
  if (!device) {
    return next(new AppError(`Device Not Found.`, 404));
  }
  await device.delete();
  res.status(200).json({ message: "Deleted!" });
});
