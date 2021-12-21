const express = require("express");
const { isAuthenticatedUser } = require("../controllers/auth");
const { authorizeRoles } = require("../controllers/productController");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUserPassword,
  updateUserProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");
const router = express.Router();

// Authentication

router.route("/register").post(registerUser);

router.route("/login").post(loginUser); //http://localhost:4000/api/v1/login

router.route("/password/forgot").post(forgotPassword); // http://localhost:4000/api/v1/password/forgot

router.route("/logout").get(logout); // http://localhost:4000/api/v1/logout

router.route("/password/reset/:token").put(resetPassword);

// User Routes
router.route("/me").get(isAuthenticatedUser, getUserDetails); // http://localhost:4000/api/v1/me
router.route("/password/update").put(isAuthenticatedUser, updateUserPassword);
router.route("/me/update").put(isAuthenticatedUser, updateUserProfile); // http://localhost:4000/api/v1/me/update

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);
// http://localhost:4000/api/v1/admin/users

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);
// http://localhost:4000/api/v1/admin/user/61bc730c19145f1b09208894

// Update User Role -- Admin
router
  .route("/admin/user/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);
// http://localhost:4000/api/v1/admin/user/61bd99387abecd66cd5016a3

// // Delete User -- Admin
router
  .route("/admin/user/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
// http://localhost:4000/api/v1/admin/user/61bd99387abecd66cd5016a3

module.exports = router;
