const express = require("express");
const { isAuthenticatedUser } = require("../controllers/auth");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { authorizeRoles } = require("../controllers/productController");
const router = express.Router();

// Create New Order
router.route("/order/new").post(isAuthenticatedUser, newOrder);
//http://localhost:4000/api/v1/order/new

// get Single Order
router
  .route("/order/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleOrder);
// http://localhost:4000/api/v1/order/61bdd2280f64772352a73b15

//Routes for Orders

// get Logged in User Orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders);
//http://localhost:4000/api/v1/orders/me

// Get All Orders -- Admin
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
// http://localhost:4000/api/v1/admin/orders

// update Order Status -- Admin
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
// http://localhost:4000/api/v1/admin/order/61bde92ba888879b0d7d5e2d

// delete Order --Admin
router
  .route("/admin/order/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);
//http://localhost:4000/api/v1/admin/order/61bdd2280f64772352a73b15

module.exports = router;
