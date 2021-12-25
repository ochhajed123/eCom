const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // for token generation

// define a schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter your Name"],
    maxlength: [30, "Name cannot exceed 30 characters"],
    minlength: [5, "Name should have atleast 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter your Name"],
    unique: true,
    validate: [validator.isEmail, "Please Enter Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Enter Your Password"],
    minlength: [8, "Password should be atleast 8 characters"],
    select: false, // To not show info in DB queries
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date, // for expiration of generated code used in Password Reset
});

// Before saving data to DB encrypt Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 5);
});

// Login at the Time of Registration
// JWT Token
// // assign a function to the "methods" object of our userSchema
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    // this._id - getting from USer Schema

    expiresIn: process.env.JWT_EXPIRE, // to time out for logout
  });
};

// compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex"); //token of 20 Bytes will be generated

  // Hashing and adding to User Schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken; // why this is returned in "resetPasswordToken"
};

module.exports = mongoose.model("User", userSchema);

/**
 * Sample JSON
 * 
 * 
 {
    "success": true,
    "user": {
        "name": "oshan3",
        "email": "oshan3@gmail.com",
        "password": "$2a$10$G0N75PsBUkll/98ZSAfm/er1iC/jOxLcMnBAdY/xZcPARYh0PfEJK",
        "avatar": {
            "public_id": "This is sample Id",
            "url": "PublicUrl"
        },
        "role": "user",
        "_id": "61b6476cd63a493f2739e5e5",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjY0NzZjZDYzYTQ5M2YyNzM5ZTVlNSIsImlhdCI6MTYzOTMzNTc4OCwiZXhwIjoxNjM5NzY3Nzg4fQ.Elsv2sSPgzz6aqyxi-8pCPs40P7Q6IOya3PZ07r7Egw"
}
 * 
 */
