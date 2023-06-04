module.exports = {
  neo4jConnect: require("./neo4jDatabase").connectNeo4j,
  neo4jClient: require("./neo4jDatabase").neo4jClient,
  redisConnect: require("./redisDatabase").connectRedis,
  redisClient: require("./redisDatabase").client,
  neo4jSession: require("./neo4jDatabase").session,
};
