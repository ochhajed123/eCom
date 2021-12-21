const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//Handling UnCaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Serving Down Server due to uncaught Exception");
  process.exit(1);
});

//config
dotenv.config({ path: "backend/config/config.env" });

//connecting To Database
connectDatabase();

//server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

// unhandled Promise Rejection Error
process.on("unhandledRejection", (err) => {
  console.log(`Error:, ${err.message}`);
  console.log("Shutting Down Server due to Unhandled Promise Rejection");
  // To close server manually If any Unhandled Error Occured
  server.close(() => {
    process.exit(1);
  });
});
