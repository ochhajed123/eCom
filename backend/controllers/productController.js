const Product = require("../models/productModel");
// Error Handling
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Apifeatures = require("../utils/apifeatures");

// Create New Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; // At time of login we have saved User Id in "req.user.id"
  // use create() method on Product Model
  const product = await Product.create(req.body);
  // response
  res.status(201).json({
    success: true,
    product,
  });
});

/**
 {
    "success": true,
    "product": {
        "name": "new",
        "description": "For ratings",
        "price": 1111,
        "ratings": 1,
        "images": [
            {
                "public_id": "Sample Public Id",
                "url": "Sample Url",
                "_id": "61bda9565781aad9a2982fe7"
            }
        ],
        "category": "Mobile Phone",
        "stock": 10,
        "numberOfReviews": 0,
        "reviews": [
            {
                "name": "Customer 1",
                "rating": 21,
                "comment": "This is nice product",
                "_id": "61bda9565781aad9a2982fe8"
            }
        ],
        "_id": "61bda9565781aad9a2982fe6",
        "createdAt": "2021-12-18T09:26:46.969Z",
        "__v": 0
    }
}
 */

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  //pagination
  const resultPerPage = 4;
  const productCount = await Product.countDocuments();
  // Searching, Filtering , Pagination
  const apiFeature = new Apifeatures(Product.find(), req.query)
    .search()
    .filter();

  //Eg - keyword is samosa (what we wanted to search in Product )
  // query - Product.find(), queryStr - req.query.keyword

  // get products
  let products = await apiFeature.query;
  // get filtered products count
  let filteredProductCount = products.length;

  apiFeature.pagination(resultPerPage);

  // const products = await Product.find();
  products = await apiFeature.query.clone(); // Bcz query is Product.find()

  res.status(200).json({
    // Access these values in reducer
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductCount,
  });
});

// Update Existing Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  // use let because we will be changing This itself
  let product = await Product.findById(req.params.id);

  // if Prooduct is not available
  if (!product) {
    // return res.status(500).json({
    //   success: false,
    //   message: "Product is Not Available",
    // });
    return next(new ErrorHandler("Product is Not Available", 404));
  }

  //if product is available
  // req.params.id - To get product id
  // req.body - This will be new Update
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product -- Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  // find product
  let product = await Product.findById(req.params.id);

  if (!product) {
    // return res.status(404).json({
    //   success: false,
    //   message: "Product is not Available...",
    // });
    return next(new ErrorHandler("Product is not Available...", 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully...",
  });
});

// Get Product Details By Id - for single product
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  // next is callback func
  const product = await Product.findById(req.params.id);

  if (!product) {
    // return res.status(500).json({
    //   success: false,
    //   message: "Product is not Available",
    // });
    return next(new ErrorHandler("Product Not found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // if user role is not included in req
      // Eg - roles had "admin" and req.user.role doesn't have "admin"
      return next(
        new ErrorHandler(
          `Role : ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    // if role is included in req.user.role then simply skip
    next();
  };
};

// Create New Review Or Update Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating), // convert into rating
    comment,
  };

  // find product
  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find((rev) => {
    rev._id.toString() === req.user._id.toString();
  }); // get id of user who created this rating

  if (isReviewed) {
    // if User Reviewed Before then
    product.review.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    // if first time User is adding Reviews
    product.reviews.push(review); // add new reviews to productSchema.reviews[]
    product.numberOfReviews = product.reviews.length; // to update review count
  }

  //overall product ratings - take average from rating in reviews
  // 4,5,5,2 = 16/4 = 4 is average of all four numbers
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  });
});

// Get all Reviews of Single Product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  // get product
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

/**
 {
    "success": true,
    "reviews": [
        {
            "name": "Customer 1",
            "rating": 21,
            "comment": "This is nice product",
            "_id": "61bda9565781aad9a2982fe8"
        },
        {
            "user": "61bd728bfa8558d5f48b5b86",
            "name": "oshan4",
            "rating": 4,
            "comment": "Just Okay",
            "_id": "61bdabea9d1883785707dff4"
        },
        {
            "user": "61bd728bfa8558d5f48b5b86",
            "name": "oshan4",
            "rating": 4,
            "comment": "Just Okay",
            "_id": "61bdadbf35abb56897c05f57"
        },
        {
            "user": "61bd728bfa8558d5f48b5b86",
            "name": "oshan4",
            "rating": 4,
            "comment": "Just Okay",
            "_id": "61bdadd4ff792a5d852ec08d"
        }
    ]
}
 */

// delete review
exports.deletereview = catchAsyncErrors(async (req, res, next) => {
  // get product
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product Not found", 404));
  }

  // get all reviews which we don't want to delete
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString() // this is id which we want to delete - req.query.id
  );

  // For new Reviews we need to change rating also
  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;

  const numberOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Product Review Deleted Successfully",
  });
});
