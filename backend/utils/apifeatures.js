// For Search, filter, Pagination - Funcationalities

class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.querystr = queryStr;
  }

  //Search Feature of API
  search() {
    // http://localhost:4000/api/v1/products?keyword=I-Phone-First sec
    const keyword = this.querystr.keyword
      ? {
          // keyword found
          name: {
            $regex: this.querystr.keyword,
            $options: "i", //case Insensitive , for MongoDB
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    // http://localhost:4000/api/v1/products?keyword=I-Phone-First sec&category=Mobile Phone

    //filter for category
    const queryCopy = { ...this.querystr }; // creating copy
    // output: queryCopy { keyword: 'product', category: 'laptop' }

    // Remove some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);
    // output: queryCopy { category: 'laptop' }

    //Filter for Price and ratings
    // http://localhost:4000/api/v1/products?keyword=I-Phone-First sec&price[gte]=1000

    let queryStr = JSON.stringify(queryCopy); // to convert into string
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `${key}`);

    // this.query = this.query.find(queryCopy);
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  //Pagination
  pagination(resultPerPage) {
    // http://localhost:4000/api/v1/products?keyword=I-Phone-First sec&page=1000

    // to get current page
    const currentPage = Number(this.querystr.page) || 1; // convert in number

    // queryStr - means whatever query comes in URL
    // queryStr = keyword, page, price
    // Eg - queryStr.keyword, queryStr.price

    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip); // getting values from DB
    // this.query - is find() method

    return this;
  }
}

module.exports = ApiFeatures;
// query in URL means anything after ? Eg -
// "http://localhost:4000/products?keyword=samosa"
// So queryStr is keyword = samosa
// query is Product.find()
