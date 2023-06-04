const { StatusCodes } = require("http-status-codes");

class ForbiddenError extends Error {
  constructor(
    msg = `something went wrong`,
    explanation = `something went wrong`
  ) {
    super();
    this.name = `ForbiddenError`;
    this.message = msg;
    this.explanation = explanation;
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
