const redis = require("redis");
const { dbConfig } = require("../config/index");

// consists of client to connect the redis database
const client = redis.createClient({
  socket: {
    host: dbConfig.REDIS_URL,
    port: dbConfig.REDIS_PORT,
  },
  password: dbConfig.REDIS_PASSWORD,
});

const connectRedis = async () => {
  await client.connect();
  console.log(`redis database is connected`);
};

module.exports = { connectRedis, client };
