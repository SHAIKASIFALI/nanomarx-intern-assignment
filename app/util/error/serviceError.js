const { StatusCodes } = require("http-status-codes");

class ServiceError extends Error {
  constructor(
    msg = `something went wrong in the service layer`,
    explanation = `something went wrong in the service layer`
  ) {
    super();
    this.name = `ServiceError`;
    this.message = msg;
    this.explanation = explanation;
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = ServiceError;
