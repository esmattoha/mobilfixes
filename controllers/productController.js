const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");
const Product = require("./../models/productModel");
const AppError = require("../utils/appError");
const errorMessages = require("../resources/errorMessages");

const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Product.find({ status: "published" }),
    req.query
  )
    .filter()
    .sort()
    .limitedFields()
    .paginate();

  const products = await features.query;

  res.status(200).json({
    status: "success",
    data: products,
  });
});

const show = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

const store = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  if (!product) {
    return next(new AppError(errorMessages.GENERAL, 400));
  }

  res.status(201).json({
    status: "success",
    data: product,
  });
});

const update = catchAsync(async (req, res, next) => {
  const { id } = req.params.id;

  const product = await Product.findByIdAndUpdate(id, req.body);

  res.status(200).json({
    status: "success",
    data: product,
  });
});

const destroy = catchAsync(async (req, res, next) => {
  const { id } = req.params.id;

  const product = await Product.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
