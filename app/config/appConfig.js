const dotenv = require("dotenv");

dotenv.config();

// contains all the application configuration details..
module.exports = {
  PORT: process.env.PORT,
};
