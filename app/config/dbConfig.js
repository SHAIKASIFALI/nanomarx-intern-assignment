const dotenv = require("dotenv");

dotenv.config();
// contains all the database configuaration details..
module.exports = {
  NEO4J_URI: process.env.NEO4J_URI,
  NEO4J_USERNAME: process.env.NEO4J_USERNAME,
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,
  AURA_INSTANCEID: process.env.AURA_INSTANCEID,
  AURA_INSTANCENAME: process.env.AURA_INSTANCENAME,
  REDIS_URL: process.env.REDIS_URL,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_PORT: process.env.REDIS_PORT,
};
