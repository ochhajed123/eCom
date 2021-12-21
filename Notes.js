{
  /*

  Backend :

1. Controller
2. Routes
3. Server
4. mongoose
5. API
6. CRUD Operations
7. Error Handling
8. Search Filter Pagination
9. Authentication
10.User Routes and APIs (Admin Tasks) - User Reviews, check Users , Update User Role
11. Order APIs

Frontend:

1.


const { config } = require("dotenv")

## Commands From Starting of Project Development:

1. Create Backend :
$ npm i express mongoose dotenv;  
$ npm init;
$ npm i nodemon; - To install node modules

2. Create config.env file for mentioning golbal variables

3. Create ProductController in - controllers

4. Create productRoute in -routes

5. Create Routes in app.js

6. Create server in serverjs 

7. Make connections with DB using mongoose - "backend/config/database.js"

8. Make Product API

Import model --> productController --> productRoute

9. Create All CRUD Operations API for Product having following Routes - 

// Get All Products
router.route("/products").get(getAllProducts);
// Create New Product -- Admin
router.route("/product/new").post(createProduct);
// Update Existing Product -- Admin
router.route("/product/:id").put(updateProduct);
// Delete Product -- Admin
router.route("/product/:id").delete(deleteProduct);
// Get Product Details By Id - for single product
router.route("/product/:id").get(getProductDetails);

10. Error Handling 
/utils/errorHandler.js

11. Create middleware for Errors - /middleware/error.js

12. Search, filter, Pagination
/utils/apiFeatures

13. Backend User Password & Authentication

bcrypt - to convert User Passwords to Hash and save in DB (To hide it)
jsonwebtoken - to generate token
validator - for email validation
nodemailer - OTP, reset password email for forgot password
cookie-parser - to store token in cookie

/models/userModel.js
/routes/userRoute.js
/controller/userController

for Encrypt Password before saving it To DB use bcrypt - /models/userModel.js

Login at the Time of Registration - /models/userModel.js - userSchema.methods.getJWTToken() 

Function for Authentication - Specific Functionalities should be allowed to user who is logged in only 



User Functionality - Register,Login, Password Reset, User Logout, Adding Admin Roles to Routes

generating Password Reset Token -  /userSchema.methods.getResetPasswordToken
reset Password Token - send through email - /exports.forgotPassword() using - "nodemailer"

After sending email to user About link for Password change using nodemailer need to make post Request to get new user password

14. Backend - User Routes and APIs
To check Profile Details/Update Profile for your self

15 . Creating Some Admin Routes for tasks like :
- Admin wants to check How many Users are there.
- Update User Role

16. User Should be able to add Reviews


FrontEnd :

1. Install app in frontend folder- $ oshanchhajed@oshans-MacBook-Air frontend % npx create-react-app .   
2. Install dependencies - $ npm i axios react-alert react-alert-template-basic react-helmet react-redux redux redux-thunk redux-devtools extension react-router-dom overlay-navbar
3. Layout - Header , Footer
4. components - Home, Product
5. Implementing Redux
for Ratings - $ npm i react-rating-stars-component;   



  You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.4:3000

    "proxy": "http://localhost:4000"

6.Implement Loader
7. Product Details - New Page to display Product Details
*/
}
