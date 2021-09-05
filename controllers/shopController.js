// Import Dependencies
const Shop = require("../models/shopModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/appError");
const mongoose = require("mongoose");

/*
 *   Fetching Shops
 */
exports.index = catchAsync(async (req, res, next) => {
  const shops = await Shop.find().populate("user").sort("-_id");
  if (shops.length <= 0) {
    return next(new AppError(`No shop found`, 404));
  }
  res.status(200).send(shops);
});

////   I don't understand this,,
/*
 *
 */
exports.search = catchAsync(async (req, res, next) => {
  const shops = await Shop.aggregate().near({
    near: {
      type: "Point",
      coordinates: [-0.12766, 51.507276],
    }, // required
    maxDistance: 10000000,
    spherical: true,
    distanceField: "dis",
    // limit:10
  });
  res.send(shops);
});

/*
 *   Fetch Single shop resource
 */
exports.show = catchAsync(async (req, res, next) => {
  const shopId = req.params.shopId;
  const shop = await Shop.findById(shopId).populate("userId");
  if (!shop) {
    return next(new AppError(`Shop not found`, 404));
  }
  res.status(201).json(shop);
});

/*
 *  Store shop
 */
exports.store = catchAsync(async (req, res, next) => {
  const {
    title,
    address,
    repairs,
    phone,
    services,
    cover,
    location,
  } = req.body;

  //  Checking all field is available here or not
  if (
    !title ||
    !address ||
    !phone ||
    !services ||
    !cover ||
    !repairs ||
    !location
  ) {
    return next(new AppError(`Please fill all the required fields`, 422));
  }

  const shop = new Shop({
    user: req.user._id,
    title,
    services,
    phone,
    cover,
    address,
    location: {
      type: "Point",
      coordinates: [location.long, location.lat],
    },
    repairs,
  });
  const createdShop = await shop.save();

  // Checking shop created or not
  if (!createdShop) {
    return next(new AppError(`Something went wrong try again later`, 411));
  }
  res.status(201).json(createdShop);
});

/*
 *   Delete a Shop by shopId
 */
exports.deleteShop = catchAsync(async (req, res, next) => {
  const shopId = req.params.shopId;
  const shop = await Shop.findByIdAndDelete(shopId);
  if (!shop) {
    return next(new AppError(`Shop not found`, 404));
  }
  res.status(200).json({ message: "Shop Deleted!" });
});

/*
 *   Update a Shop by shopId
 */
exports.updateShop = catchAsync(async (req, res, next) => {
  const shopId = req.params.shopId;
  const {
    title,
    address,
    repairs,
    phone,
    services,
    cover,
    location,
  } = req.body;

  //  Checking all field is available here or not
  if (
    !title ||
    !address ||
    !phone ||
    !services ||
    !cover ||
    !repairs ||
    !location
  ) {
    return next(new AppError(`Please fill all the required fields`, 422));
  }
  const shop = await Shop.findByIdAndUpdate(shopId, {
    $set: {
      title: title,
      address: address,
      phone: phone,
      services: services,
      cover: cover,
      repairs: repairs,
      location: location,
    },
  });
  if (!shop) {
    return next(new AppError(`Shop not found`, 404));
  }
  res.status(200).json({
    message: "Shop Updated!",
  });
});

/*
 *  Match the reapir system and find those shops
 */
exports.matchShops = catchAsync(async (req, res, next) => {
  const { repair } = req.params;
  const { long, lat, service } = req.body;

  const shops = await Shop.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [long, lat],
        },
        maxDistance: 100000000,
        spherical: true,
        distanceField: "dis",
        // $limit:5
      },
    },
    {
      $match: {
        repairs: mongoose.Types.ObjectId(repair),
        services: service,
      },
    },
  ]);

  if (shops.length <= 0) {
    return next(new AppError(`No Shops found.`, 404));
  }
  return res.status(200).json({ shops: shops });
});
