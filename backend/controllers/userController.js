const User = require("../models/userModel");
// Error Handling
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register A User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is sample Id",
      url: "PublicUrl",
    },
  });

  // const token = user.getJWTToken();

  // res.status(201).json({
  //   success: true,
  //   // user,
  //   token,
  // });

  sendToken(user, 201, res);

  /**
   * 
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjY0N2RjMWFlNGIyMGFjZThiODgwYiIsImlhdCI6MTYzOTMzNTkwMCwiZXhwIjoxNjM5NzY3OTAwfQ.tCGt2ViXkxkaw_lzWJsktmqRmf-sn52pk_VwuA3gIb0"
  }
   */
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //checking if User has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and Password", 400));
  }

  // if we get both email & password - get the User
  const user = await User.findOne({ email }).select("+password"); // password is select:false So need to mention separately

  if (!user) {
    return next(new ErrorHandler("Invalid email or Password", 401));
  }

  // if we get password
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or Password", 401));
  }

  // const token = user.getJWTToken();

  // res.status(200).json({
  //   success: true,
  //   token,
  // });

  sendToken(user, 200, res);
});

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()), // Expire right now
    httpOnly: true,
  }); //make value of "token" keyword as null and provide options in {}
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});

// Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // find User
  const user = await User.findOne({ email: req.body.email });
  console.log("user", user);
  if (!user) {
    return next(new ErrorHandler("User Not Found ", 404));
  }

  //Get reset password Token
  const resetToken = user.getResetPasswordToken(); // getting Reset Token from this Func

  // to save user Bcz generated Token in User Model is not saved anywhere
  await user.save({ validateBeforeSave: false });

  // Till now we got password and we saved it, Now create link to send email
  // http://localhost/api/v1/password/reset/${resetToken}

  // Creating link to send email
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  //resetPasswordUrl - http://localhost:4000/api/v1/password/reset/675abced0305e258a99f84669988a4d0048f7286

  // message to send in Email to Customer
  const message = `Your Password Reset Token is :- \n \n ${resetPasswordUrl} \n \n If you have not requested This Email then Please Ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecom Website Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Sent to ${user.email} successfully`,
    });
  } catch {
    // if we get error
    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // Now we should save user
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // After we sent pAwword link successfully Now this func will receive User New Password
  // Access User token from URL using params
  //  http://localhost:4000/api/v1/password/reset/5cddc37fcac74063dc43a7855c71cad5360d4206

  // Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token) // getting token in params
    .digest("hex");

  // find User in DB using Above token-resetPassword
  const user = await User.findOne({
    resetPasswordToken,
    // expire time should be greater than Date.now()
    resetPasswordExpire: { $gt: Date.now() },
  });

  //If we don't User
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is Invalid or has been Expired",
        400
      )
    );
  }

  // If new Password and confirm Pwrd not matched
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("Password does Not match with Confirm Password")
    );
  }

  user.password = req.body.password; // Password changed in DB
  // This was changed in DB so need to do undefined
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  // After Password change User should be logged in
  sendToken(user, 200, res);
});

/** For Password Reset using - resetPassword()  
 * 
http://localhost:4000/api/v1/password/reset/5fc7a36e4144b32e43ac37ecf51d2131bb731b53

req.body :

{
    "password":"123456789",
    "confirmPassword":"123456789"
}
 * 
response :

{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjYxYzUxYTlkZTdmMDUxZmJhOTBjOCIsImlhdCI6MTYzOTczOTgxNSwiZXhwIjoxNjQwMTcxODE1fQ._QE1W6ahmnK6VmJrA40hXUZTF-LHEOsySjE25kD4Low",
    "user": {
        "avatar": {
            "public_id": "This is sample Id",
            "url": "PublicUrl"
        },
        "_id": "61b61c51a9de7f051fba90c8",
        "name": "oshan",
        "email": "oshan1chhajed@gmail.com",
        "role": "user",
        "__v": 0,
        "password": "$2a$10$6Jxbdg0yf8/eTwgzrRMEteXuub9eA6qwV4wNeWjpdB4J3IIxyE.Gi"
    }
}
*/

//Get User Details - For User Himself
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  // get User
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

/**
{
  avatar: { public_id: 'This is sample Id', url: 'PublicUrl' },
  _id: new ObjectId("61bc9e263fcbe7d6f5799344"),
  name: 'preksha',
  email: 'pre@gmail.com',
  role: 'user',
  __v: 0
}
 */

// Update User Password
exports.updateUserPassword = async (req, res, next) => {
  // get user
  const user = await User.findById(req.user.id).select("+password"); // Because This time we need to select password also from Db

  // For Updating Current Password we need to have Old Password and New Password
  // compare old password with current password in DB
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is Incorrect", 401));
  }

  // For New Password
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password Does not match", 400));
  }

  // After all checks
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
};

/**
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYmQ3MjhiZmE4NTU4ZDVmNDhiNWI4NiIsImlhdCI6MTYzOTgwNzI0MiwiZXhwIjoxNjQwMjM5MjQyfQ.NgGvYyPv7BGKdNUEJOBzWiU8EqdN92Ni67D8FArVqbY",
    "user": {
        "avatar": {
            "public_id": "This is sample Id",
            "url": "PublicUrl"
        },
        "_id": "61bd728bfa8558d5f48b5b86",
        "name": "Preksha",
        "email": "preksha859@gmail.com",
        "password": "$2a$05$730kdFXb0WfDGA2URArgj.Bd3xBDcjHdIX0iHFB868VeH6X6f/EYW",
        "role": "user",
        "__v": 0,
        "resetPasswordExpire": "2021-12-18T05:48:38.471Z",
        "resetPasswordToken": "20942888193fa762cf04d4a448fc95d0f13ffff94e6be68693773ab7d5a81bcc"
    }
}
 */

//Update User Profile
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // we wil add cloudinary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
  });
});

// Get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get Single User Detail -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id); // to get id from URL

  // if User not found
  if (!user) {
    return next(
      new ErrorHandler(`User Does Not exists with Id $ {req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  // we will add clouderi later
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete User -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  // we will remove cloudinary
  const user = await User.findById(req.params.id); // get id from URl
  // Don't do - req.user.id - Otherwise Admin will update Himself
  if (!user) {
    return next(
      new ErrorHandler(`User does not exists with id: ${req.params.id}`)
    );
  }

  // delete User
  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
