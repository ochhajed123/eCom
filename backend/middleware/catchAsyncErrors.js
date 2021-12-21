// SAME FUNCTION AS try catch BLOCK FOR ERROR HANDLING

module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch(next);
  // if it fells then catch Block
};
