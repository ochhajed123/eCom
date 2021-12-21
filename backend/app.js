const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");

app.use(express.json()); // used for res sending - res.json()
app.use(cookieParser()); // to store token in cookie

//Route Imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

// middleware for Errors
app.use(errorMiddleware);

module.exports = app;

// 4.43
