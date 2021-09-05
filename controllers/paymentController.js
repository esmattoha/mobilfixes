const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const catchAsync = require("../utils/catchAsync");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (orderDetails, customer, amount) => {
  const intentObject = {
    amount: parseInt(amount * 100),
    currency: process.env.CURRENCY,
    metadata: {
      orderNumber: orderDetails.orderNumber,
    },
    receipt_email: orderDetails.customerInfo.email,
  };

  let stripeCustomerId = customer.stripeId || null;
  // Check if the customer has a Stripe Customer id in db
  if (stripeCustomerId) {
    // Fetch Saved Payment methods with associated custmerId
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });

    if (paymentMethods.data.length > 0) {
      intentObject.payment_method = paymentMethods.data[0].id;
      intentObject.off_session = true;
      intentObject.confirm = true;
    }
    // Create Ofsession charge
  } else {
    // Create stripe intent with blank customer id
    stripeCustomerId = (
      await stripe.customers.create({
        name: customer.name,
        email: customer.email,
      })
    ).id;
    await User.findByIdAndUpdate(customer._id, {
      stripeId: stripeCustomerId,
    });

    // Todo: Hndle edge cases (3D secure, card not accepted, etc)
  }

  intentObject.customer = stripeCustomerId;
  // intentObject.setup_future_usage = "off_session";
  const paymentIntent = await stripe.paymentIntents.create(intentObject);
  return Promise.resolve(paymentIntent);
};

const getIntent = catchAsync(async (req, res) => {
  const customer = req.user;
  const { orderId, amount } = req.body;

  if (!orderId) {
    return AppError(`Invalid data input`, 406);
  }
  const order = await Order.findById(orderId);
  if (!order) {
    return AppError(`Invalid data input`, 406);
  }

  if (order.service == "mail-in") {
    // Update Order Status
    return res.status(201).json({
      clientSecret: "",
      status: "succeed",
    });
  }

  const paymentIntent = await createPaymentIntent(
    order,
    customer,
    amount || 30
  );
  res.status(201).json({
    id: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    status: paymentIntent.status,
  });
});

const store = catchAsync(async (req, res) => {
  const { paymentIntent } = req.body;
  if (!paymentIntent) {
    return AppError(`Invalid data input`, 406);
  }

  const intentData = await stripe.paymentIntents.retrieve(paymentIntent);
  const orderNumber = intentData.metadata.orderNumber;

  if (intentData.status != "succeeded") {
    return AppError(`Payment is not complete`, 400);
  }

  const order = await Order.findOneAndUpdate(
    { orderNumber },
    { status: "processing" }
  );

  const createdPayment = await Payment.create({
    order: order._id,
    customer: order.customer,
    status: intentData.status,
    amount: intentData.amount / 100,
    transactionId: intentData.id,
  });

  res.status(201).json({
    status: "success",
    data: createdPayment,
  });
});

const webhook = catchAsync(async (req, res) => {
  const event = req.body;
});

const index = catchAsync(async (req, res) => {
  const { limit } = req.query;

  const features = new APIFeatures(
    Payment.find({ customer: req.user._id }),
    req.query
  )
    .sort()
    .paginate();

  const payments = await features.query.populate({
    path: "order",
    select: "orderNumber",
  });

  const totalPayment = await Payment.countDocuments({ customer: req.user._id });

  res.status(200).json({
    status: "success",
    totalPage: Math.floor(totalPayment / (limit || 10)) + 1,
    data: payments,
  });
});

const getPaymentMethods = catchAsync(async (req, res, next) => {
  const customer = req.user;
  const stripeCustomerId = customer.stripeId || null;

  if (!stripeCustomerId) {
    return new AppError(`No Payment Methods exists`, 404);
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: stripeCustomerId,
    type: "card",
  });
  res.status(200).json({
    status: "success",
    data: paymentMethods,
  });
});

module.exports = {
  getIntent,
  store,
  index,
  getPaymentMethods,
  createPaymentIntent,
};
