const Order = require("../models/orderModel");
const Shipment = require("../models/shipmentModel");
const errorMessages = require("../resources/errorMessages");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const shippo = require("shippo")(process.env.SHIPPO_API_KEY);

const index = catchAsync(async (req, res) => {
  const shipmentsFeatures = new APIFeatures(Shipment.find({}), req.query)
    .filter()
    .limitedFields()
    .sort()
    .paginate();

  const shipments = await shipmentsFeatures.query;

  res.status(200).json({
    status: "success",
    results: shipments.length,
    data: shipments,
  });
});

const show = catchAsync(async (req, res) => {
  const { id } = req.params;
  const shipment = await Shipment.findById(id).populate("booking");
  if (!shipment) {
    return res.status(404).json({
      status: "error",
      message: errorMessages.RESOURCE_NOT_FOUND,
    });
  }
  res.status(200).json({
    status: "success",
    data: shipment,
  });
});

// Store a new shipment
const store = catchAsync(async (req, res) => {
  // Get Customer Info
  // Get Booking Info
  // Get Address
  // Make api call to Shippo to create a shipment
  // Create a new shipment
  // Store data in db
  // Send an email to the customer

  const { id } = req.params;
  const orderId = id;

  // const existingShipment = await Shipment.findOne({ order: orderId });
  // if (existingShipment) {
  //   return res.status(409).json({
  //     status: "error",
  //     message: "Shipment label for this Resource is already exits",
  //   });
  // }

  const order = await Order.findById(orderId);

  if (order.customer.toString() != req.user._id) {
    return res.status(403).json({
      status: "error",
      message: errorMessages.FORBIDDEN,
    });
  }

  if (order.appointmentTime != null) {
    return res.status(403).json({
      status: "error",
      message: "Bad request",
    });
  }

  //   console.log(await shippo.parcel.list());

  const customer = order.customerInfo;
  const customerAddress = order.shippingAddress;

  const addressTo = {
    name: customer.name,
    street1: customerAddress.addressLine1,
    city: customerAddress.city,
    state: customerAddress.state,
    zip: customerAddress.zipcode,
    country: "US",
    phone: customer.phone,
    email: customer.email,
  };

  const addressFrom = {
    name: "MobilFixes Inc.",
    street1: "3001 Fulton Street",
    city: "Brooklyn",
    state: "NY",
    zip: "11208",
    country: "US",
    email: "hello@mobilfixes.com",
  };

  const parcel = {
    length: "5",
    width: "5",
    height: "5",
    distance_unit: "in",
    weight: "2",
    mass_unit: "lb",
  };

  // Maki API call to Shippo and create return shiiping label

  // Shipment returns shipping rates
  const shipment = await shippo.shipment.create({
    address_from: addressFrom,
    address_to: addressTo,
    parcels: [parcel],
    extra: { is_return: true },
    async: false,
  });

  // Make new transaction api call to get shiiping label
  // Purchase the desired rate.
  if (!shipment && !shipment.rates[0].object_id) {
    return res.status(500).json({
      status: "error",
      message: "Error creating Shipment",
    });
  }

  const shippingLabel = await shippo.transaction.create({
    rate: shipment.rates[0].object_id,
    label_file_type: "PDF",
    async: false,
  });

  if (!shippingLabel) {
    return res.status(500).json({
      status: "error",
      message: "Error creating Shipping Label",
    });
  }

  // Save Response to db

  const newShipment = new Shipment({
    order: order._id,
    trackingNumber: shippingLabel.tracking_number,
    trackingUrl: shippingLabel.tracking_url_provider,
    labelUrl: shippingLabel.label_url,
    gatewayId: shipment.object_id,
  });
  const createdShipment = await newShipment.save();

  res.status(200).json({ status: "success", data: createdShipment });
});

const getByOrderId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const shipment = await Shipment.findOne({ order: id });

  if (!shipment) {
    return store(req, res);
  }

  res.status(200).json({
    status: "success",
    data: shipment,
  });
});

module.exports = {
  index,
  show,
  store,
  getByOrderId,
};
