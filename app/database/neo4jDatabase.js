const neo4j = require("neo4j-driver");

const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD,
} = require("../config/dbConfig");

// this variable represends the neo4j database client
const neo4jClient = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);

const session = neo4jClient.session();
// this function represents the one which is used to connect to the neo4j db
const connectNeo4j = async () => {
  try {
    if (session) console.log("neo4j database connected");
  } catch (error) {
    console.log(error);
    throw Error("error while connecting the neo4j database");
  }
};

module.exports = {
  neo4jClient,
  session,
  connectNeo4j,
};
