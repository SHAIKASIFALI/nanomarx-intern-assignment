const { StatusCodes } = require("http-status-codes");

class RepositoryError extends Error {
  constructor(
    msg = `something went wrong`,
    explanation = `something went wrong`
  ) {
    super();
    this.name = `RepositoryError`;
    this.message = msg;
    this.explanation = explanation;
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = RepositoryError;
