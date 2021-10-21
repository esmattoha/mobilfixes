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
  const product = await Product.find({slug : req.params.slug}).select("-image -status -slug");

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

const store = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const product = await Product.create(req.body);
  console.log(product);
  if (!product) {
    return next(new AppError(errorMessages.GENERAL, 400));
  }

  res.status(201).json({
    status: "success",
    data: product,
  });
});

const search = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.query.slug }).select(
    "-status"
  );

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: product,
  });
});

const searchByCategory = catchAsync(async(req, res, next) =>{
  const products = await Product.find({category:req.query.category}).select("-status -slug");
  if (products.length <= 0 ) {
    return next(new AppError("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: products,
  });
})

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
  search,
  searchByCategory,
  update,
  destroy,
};
