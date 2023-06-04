const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends Error {
  constructor(
    msg = `something went wrong`,
    explanation = `something went wrong`
  ) {
    super();
    this.name = `UnauthorizedError`;
    this.message = msg;
    this.explanation = explanation;
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
