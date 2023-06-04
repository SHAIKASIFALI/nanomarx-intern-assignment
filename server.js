// creation of the server

const http = require("http");
const app = require("./app/app");
const { PORT } = require("./app/config/appConfig");
const { neo4jConnect, redisConnect, neo4jClient } = require("./app/database");

const server = http.createServer(app);

const startServer = async () => {
  // TO perform db connections ...
  await neo4jConnect(); // to connect to the neo4j database
  await redisConnect(); // connect to the redis database..
  server.listen(PORT, () => {
    console.log(`server started listening at ${PORT} ....`);
  });
};

startServer();
