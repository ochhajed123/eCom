// creating Token and saving in COOKIE

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //options for cookie
  const options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // CONVERTED INTO MILLI SEC
    ),
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = sendToken;

/**
 * 
 {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYjY0N2RjMWFlNGIyMGFjZThiODgwYiIsImlhdCI6MTYzOTMzOTI3NSwiZXhwIjoxNjM5NzcxMjc1fQ.gIzSawL6OPfBfpVZnxPrCyP-rcJKbotWHITKABHnvCU",
    "user": {
        "avatar": {
            "public_id": "This is sample Id",
            "url": "PublicUrl"
        },
        "_id": "61b647dc1ae4b20ace8b880b",
        "name": "oshan4",
        "email": "oshan4@gmail.com",
        "password": "$2a$10$yY2kfZlWVjyZERFiUkdm5uwG2Hwb8Sh4nmU3lMliHATSVOd1r6oy2",
        "role": "user",
        "__v": 0
    }
}
 */
