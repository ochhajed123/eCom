const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create New Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  //get data from req
  const {
    shippingInfo,
    orderitems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderitems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    orderStatus,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

/**
{
    "success": true,
    "order": {
        "shippingInfo": {
            "address": "Main Road",
            "city": "Jalgaon Jamod",
            "state": "Maharashtra",
            "country": "India",
            "pinCode": 443402,
            "phoneNumber": 9404425147
        },
        "orderitems": [
            {
                "name": "Pen",
                "price": 1234,
                "quantity": 2,
                "image": "Pen Image",
                "product": "61bd89951ae03724b151d4ec",
                "_id": "61bdd2280f64772352a73b16"
            }
        ],
        "user": "61bd728bfa8558d5f48b5b86",
        "paymentInfo": {
            "id": "1111",
            "status": "received"
        },
        "paidAt": "2021-12-18T12:20:56.280Z",
        "itemsPrice": 100,
        "taxPrice": 18,
        "shippingPrice": 32,
        "totalPrice": 150,
        "orderStatus": "Processing",
        "_id": "61bdd2280f64772352a73b15",
        "createdAt": "2021-12-18T12:20:56.283Z",
        "__v": 0
    }
}
 */

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  // get order
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  // const order = await Order.findById(req.params.id);
  console.log("order", order);
  // getting name & email from User Db using user id

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

/**
{
    "success": true,
    "order": {
        "shippingInfo": {
            "address": "Main Road",
            "city": "Jalgaon Jamod",
            "state": "Maharashtra",
            "country": "India",
            "pinCode": 443402,
            "phoneNumber": 9404425147
        },
        "paymentInfo": {
            "id": "1111",
            "status": "received"
        },
        "_id": "61bdd2280f64772352a73b15",
        "orderitems": [
            {
                "name": "Pen",
                "price": 1234,
                "quantity": 2,
                "image": "Pen Image",
                "product": "61bd89951ae03724b151d4ec",
                "_id": "61bdd2280f64772352a73b16"
            }
        ],
        "user": {
            "_id": "61bd728bfa8558d5f48b5b86",
            "name": "oshan4",
            "email": "oshan4@gmail.com"
        },
        "paidAt": "2021-12-18T12:20:56.280Z",
        "itemsPrice": 100,
        "taxPrice": 18,
        "shippingPrice": 32,
        "totalPrice": 150,
        "orderStatus": "Processing",
        "createdAt": "2021-12-18T12:20:56.283Z",
        "__v": 0
    }
}
 */

// get Logged in User Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  //get order
  const orders = await Order.find({ user: req.user._id }); // Find all users from Db having same _id as Our logged in User

  res.status(200).json({
    success: true,
    orders,
  });
});

// get All Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  // get All Orders
  const orders = await Order.find();

  // to display Total Price on All Orders
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalAmount,
  });
});

/**
// totalAmount also added here in data at last 
{
    "success": true,
    "orders": [
        {
            "shippingInfo": {
                "address": "Main Road",
                "city": "Jalgaon Jamod",
                "state": "Maharashtra",
                "country": "India",
                "pinCode": 443402,
                "phoneNumber": 9404425147
            },
            "paymentInfo": {
                "id": "1111",
                "status": "received"
            },
            "_id": "61bdd2280f64772352a73b15",
            "orderitems": [
                {
                    "name": "Pen",
                    "price": 1234,
                    "quantity": 2,
                    "image": "Pen Image",
                    "product": "61bd89951ae03724b151d4ec",
                    "_id": "61bdd2280f64772352a73b16"
                }
            ],
            "user": "61bd728bfa8558d5f48b5b86",
            "paidAt": "2021-12-18T12:20:56.280Z",
            "itemsPrice": 100,
            "taxPrice": 18,
            "shippingPrice": 32,
            "totalPrice": 150,
            "orderStatus": "Processing",
            "createdAt": "2021-12-18T12:20:56.283Z",
            "__v": 0
        }
    ],
    "totalAmount": 150
}
 */

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  // get order
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(
      new ErrorHandler("You Have Already Delivered This Product", 404)
    );
  }

  // after product delivered quantity and product_id from "orderItems" should be updated
  order.orderitems.forEach(async (order) => {
    await updateStock(order.product, order.quantity);
  });

  order.orderStatus = req.body.status; // whatever status we will send

  // this if for orderStatus which we gonna send from frontend
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  // save order
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

async function updateStock(id, quantity) {
  // get product
  const product = await Product.findById(id);
  product.stock -= quantity; // product.stock = product.stock - quantity
  await product.save({ validateBeforeSave: false });
}

// delete Order --Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order Not Found", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order Deleted Successfully",
  });
});
