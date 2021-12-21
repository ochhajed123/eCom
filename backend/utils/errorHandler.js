class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor); //using method from Error class having input - (target Obj, constructor)
  }
}

module.exports = ErrorHandler;
