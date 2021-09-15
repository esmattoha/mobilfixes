const File = require("../models/fileModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.index = catchAsync(async (req, res) => {
  const files = await File.find({}).limit(10).sort({ _id: -1 });
  res.json(files);
});

/*
 */
exports.store = catchAsync(async (req, res, next) => {
  const path = req.file.path;
  if (!path) {
    return next(new AppError("Invalid data Input", 406));
  }

  const uploadedFile = new File({ path });
  const image = await uploadedFile.save();
  if (!image) {
    return next(new AppError(`Something went wrong, try again!`, 400));
  }
  res.status(201).json(uploadedFile);
});

/*
 */
exports.delete = catchAsync(async (req, res, next) => {
  const fileId = req.params.fileId;
  if (!fileId) {
    return next(new AppError("Invalid data Input", 406));
  }

  const image = await File.findByIdAndDelete(fileId);
  if (!image) {
    return next(new AppError(`Image Not Found!`, 404));
  }
  res.status(200).json({ message: "Image deleted!" });
});
