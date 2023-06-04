const { StatusCodes } = require("http-status-codes");

class NotFoundError extends Error {
  constructor(
    msg = `something went wrong`,
    explanation = `something not found`
  ) {
    super();
    this.name = `NotFoundError`;
    this.message = msg;
    this.explanation = explanation;
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
