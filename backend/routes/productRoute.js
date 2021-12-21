const express = require("express");
const { isAuthenticatedUser } = require("../controllers/auth");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  authorizeRoles,
  createProductReview,
  getProductReviews,
  deletereview,
} = require("../controllers/productController");

const router = express.Router();

// Get All Products
router.route("/products").get(getAllProducts); //http://localhost:4000/api/v1/products

// Create New Product -- Admin
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
// http://localhost:4000/api/v1/admin/product/new

// Update Existing Product -- Admin
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);
// http://localhost:4000/api/v1/admin/product/61a9a24364c8f9e9a774a893

// Delete Product -- Admin
router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);
// http://localhost:4000/api/v1/admin/product/61a9a4b81297990c8172297f

// Get Product Details By Id - for single product
router.route("/product/:id").get(getProductDetails);
// http://localhost:4000/api/v1/product/61a9a24364c8f9e9a774a893

// Create Product Review
router.route("/review").put(isAuthenticatedUser, createProductReview);
// http://localhost:4000/api/v1/review

// Get all Reviews of Single Product
router.route("/reviews").get(getProductReviews);
// http://localhost:4000/api/v1/reviews?id=61bda9565781aad9a2982fe6

// delete review
router.route("/reviews").delete(isAuthenticatedUser, deletereview);
// http://localhost:4000/api/v1/reviews?id=61bda9565781aad9a2982fe8&productId=61bda9565781aad9a2982fe6

module.exports = router;
