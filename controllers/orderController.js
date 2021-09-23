//  Import Dependencies
const Order = require("../models/orderModel");
const { generateOrderNumber } = require("../utils/orderNumberGenerate");
const Repair = require("../models/repairModel");
const Device = require("../models/deviceModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const errorMessages = require("../resources/errorMessages");
const APIFeatures = require("../utils/apiFeatures");
const { createPaymentIntent, store } = require("./paymentController");
const Product = require("../models/productModel");
const { sendEmail } = require("../utils/email");

/*
 *   Store Booking
 */
exports.store = catchAsync(async (req, res, next) => {
  const {
    type,
    items,
    productPrice,
    customerInfo,
    shippingAddress,
    billingAddress,
    customerNotes,
    service,
    appointmentTime,
  } = req.body;

  if (!type || !customerInfo || !shippingAddress || !service) {
    return next(new AppError(`Invalid input data`, 406));
  }

  //Delete Customer password
  delete customerInfo.password;

  // 
  const customer = req.user._id;
  const metaData = await getMetaData(req);
  let orderItems;
  let totalOrderAmount;

  if (items) {
    orderItems = await getOrderItems(items);
    totalOrderAmount = getTotalAmount(orderItems);
  }else{
    orderItems = await productItem(req);
  }
  
  

  // Save Order data
  const order = new Order({
    orderNumber: generateOrderNumber(),
    type,
    customer,
    customerInfo,
    metaData,
    items: orderItems,
    shippingAddress,
    billingAddress,
    customerNotes,
    totalAmount: totalOrderAmount ? totalOrderAmount : productPrice,
    service,
    appointmentTime,
    status: service == "we-come-to-you" ? "hold" : "processing",
    customNotes: customerInfo.customNotes || "",
  });

  const createdOrder = await order.save();
  if (!createdOrder) {
    return next(new AppError(`Order could not be created`, 406));
  }

  res.status(201).json({
    status: "success",
    requirePayment: createdOrder.service == "we-come-to-you",
    data: createdOrder,
  });
});

/**
 * @param req
 * @returns Repairs or Product Array
 */
const getOrderItems = async (items) => {
  // For Apoointment items are repairs
  const repairItems = items.map(async (item) => {
    return await Repair.findById(item).select("-device -services -__v");
  });
  const repairItemsData = await Promise.all(repairItems);
  return Promise.resolve(repairItemsData);
};


/**
 * 
 * @param {*} req 
 * @returns 
 */
const productItem = async (req) => {
  const { product } = req.body;

  const productData = await Product.findById(product._id);

  return Promise.resolve({
    _id: product._id,
    price: productData.maxPrice,
    device: productData.device,
    title: productData.title,
    variations: product.variations,
    condition: product.condition,
    questions: product.questions,
  });
};

/**
 *
 * @param orderItems : Array of Items Objects
 * @returns  Total amount of items
 */
const getTotalAmount = (orderItems) => {
  const reducer = (accumulator, curr) => accumulator + curr;
  const itemsPrice = orderItems.map((item) => {
    return item.price;
  });
  return itemsPrice.reduce(reducer).toFixed(2);
};
/**
 * @param req
 * @returns promise
 */
const getMetaData = async (req) => {
  const { model, device } = req.body;

  const deviceData = await Device.findById(device).select(
    "-parent -image -__v"
  );
  const modelData = await Device.findById(model).select("-parent -image -__v");

  return Promise.resolve({
    device: deviceData,
    model: modelData,
  });
};

/*
 *  Customer's bookings
 */
exports.showCustomerBookings = catchAsync(async(req, res, next) =>{
  const { limit } = req.query;
  const customer = req.user._id;

  if (!customer) {
    return next(new AppError("Invalid customer id", 403));
  }
  // Fetching all bookings with filter by customer and queries

  const features = new APIFeatures(
    Order.find({ customer: customer }),
    req.query
  )
    .filter()
    .sort()
    .limitedFields()
    .paginate();

  const customerBookings = await features.query;

  // count total bookings with filters on
  const totalBookingsQuery = new APIFeatures(
    Order.countDocuments({ customer: customer }),
    req.query
  ).filter(true);

  const totalBookings = await totalBookingsQuery.query;

  res.status(200).json({
    status: "success",
    totalResutls: totalBookings,
    pageCount: Math.floor(totalBookings / (limit || 10)) + 1,
    data: customerBookings,
  });
})

/*
 *   Fetch All Bookings
 */
exports.index = catchAsync(async (req, res, next) => {
  const { limit } = req.query;

  // Fetching all bookings with filter
  const features = new APIFeatures(Order.find(), req.query)
    .filter()
    .sort()
    .limitedFields()
    .paginate();
  const bookings = await features.query;

  // Fecthing total bookings with filter
  const totalBookingsQuery = new APIFeatures(
    Order.countDocuments(),
    req.query
  ).filter(true);
  const totalBookings = await totalBookingsQuery.query;

  if (bookings.length <= 0) {
    return next(new AppError(errorMessages.RESOURCE_NOT_FOUND, 404));
  }
  res.status(200).json({
    status: "success",
    totalResults: totalBookings,
    pageCount: Math.round(totalBookings / (limit || 10)),
    results: bookings.length,
    data: bookings,
  });
});

/*
 *   Fetch Booking
 */
exports.show = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate("payments");

  if (!order) {
    return next(new AppError(errorMessages.RESOURCE_NOT_FOUND, 404));
  }

  res.status(200).json({ status: "success", data: order });
});

/*
 *   Update Booking
 */
exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id)
    .populate("customer")
    .populate("payments");

  if (!order) {
    return next(new AppError(errorMessages.RESOURCE_NOT_FOUND, 404));
  }

  const customerEmail = order.customer.email;
  order.status = status;

  if (status === "completed") {
    order.deliveredAt = Date.now();
    res.status(200).json({ message: "Successfull" });
  }

  if (status == "cancelled") {
    // Charge the card
    await order.save();
    res.status(200).json({ message: "Successfull" });
  }

  if (!order.customer.stripeId) {
    return next(new AppError(`Customer doesn't have a card`, 400));
  }

  if (order.dueAmount <= 0) {
    await order.save();
    return res.status(200).json({ message: "Successfull" });
  }

  const paymentIntent = await createPaymentIntent(
    order,
    order.customer,
    order.dueAmount
  );
  if (paymentIntent.status !== "succeeded") {
    return next(new AppError(`Payment failed`, 400));
  }
  req.body.paymentIntent = paymentIntent.id;
  await order.save();
  await sendEmail({
    email : customerEmail,
    subject : "Order Update",
    html : `
    <h1>Order Update Report</h1>
    <p>your order has ${status}</p>
    `
  });
  return store(req, res);
});


/*
 *   Delete Booking
 */
exports.delete = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const orderId = id;

  const doc = await Order.findByIdAndDelete(orderId);

  if (!doc) {
    return next(new AppError(errorMessages.RESOURCE_NOT_FOUND, 404));
  }

  res.status(200).json({ message: "Deleted" });
});

/*
 *   Search a Date receiveable for Booking
 */
exports.search = catchAsync(async (req, res, next) => {
  const { date } = req.body;
  const booking = await Order.find({ appointmentTime: date });

  if (booking.length <= 0) {
    return next(new AppError(`The selected date is unavailable`, 404));
  }

  const booked = await booking.map((p) => {
    return p.appointmentTime;
  });
  
  res.status(200).json(booked);
});

/*
 *   Find Appointment Dates
 */
exports.appointmentDates = catchAsync(async (req, res, next) => {
  const appointmentDates = await Order.aggregate([
    {
      $match: {
        status: {
          $in: ["processing", "confirmed"],
        },
        appointmentTime: {
          $gte: new Date(),
        },
      },
    },
    {
      $group: {
        _id: {
          $add: [
            {
              $dayOfYear: "$appointmentTime",
            },
            {
              $multiply: [
                400,
                {
                  $year: "$appointmentTime",
                },
              ],
            },
          ],
        },
        appointments: {
          $sum: 1,
        },
        d: {
          $min: "$appointmentTime",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        date: "$d",
        appointments: "$appointments",
        _id: 0,
      },
    },
  ]);
  res.status(200).json(appointmentDates);
});

