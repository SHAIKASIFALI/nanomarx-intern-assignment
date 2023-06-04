const { StatusCodes } = require("http-status-codes");

class BadRequestError extends Error {
  constructor(
    msg = `something went wrong in the request`,
    explanation = `something went wrong`
  ) {
    super();
    this.name = `BadRequestError`;
    this.message = msg;
    this.explanation = explanation;
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
