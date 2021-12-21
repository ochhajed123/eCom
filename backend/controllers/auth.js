const jsonwebtoken = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  /**
$ console.log(token);

Server is working on http://localhost:4000
Mongodb connected with server: localhost
{
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjY0N2RjMWFlNGIyMGFjZThiODgwYiIsImlhdCI6MTYzOTMzOTU2OCwiZXhwIjoxNjM5NzcxNTY4fQ.Z80-6RSRFmVChZWgFMvHKosTW2DMnm3nQo-DCp4bIWY'
}
   * 
   */

  if (!token) {
    return next(new ErrorHandler("Please Login To Access this Resource", 401));
  }

  //if we get token
  const decodedData = jsonwebtoken.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decodedData.id); // we can access User data whenever it's login
  console.log(req.user);
  next(); // callback func
});

// At time of login, token is stored in cookie
