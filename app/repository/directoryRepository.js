const { neo4jSession } = require("../database");
const RepositoryError = require("../util/error/repositoryError");

class DirectoryRepository {
  async findDirectory(path, parameter) {
    try {
      const isRecursive = parameter.isRecursive === "true";

      let cypherQuery = `
    MATCH (dir:Directory {path: $directoryPath})
    OPTIONAL MATCH (dir)-[:CONTAINS]->(file:File)
    OPTIONAL MATCH (dir)-[:CONTAINS]->(subdir:Directory)
    `;

      if (isRecursive) {
        cypherQuery += `
      OPTIONAL MATCH (subdir)-[:CONTAINS]->(subFile:File)
      WITH dir, COLLECT(file) AS files, COLLECT(subdir) AS directories, COUNT(file) AS fileCount, COUNT(subdir) AS directoryCount, COLLECT(subFile) AS subFiles
      RETURN dir, files, directories, fileCount, directoryCount, subFiles, SIZE(subFiles) AS subFileCount
    `;
      } else {
        cypherQuery += `
      RETURN dir, COLLECT(file) AS files, COLLECT(subdir) AS directories, COUNT(file) AS fileCount, COUNT(subdir) AS directoryCount
    `;
      }
      console.log(cypherQuery);
      const result = await neo4jSession.run(cypherQuery, {
        directoryPath: path,
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the directory repository layer",
        "error occured while finding repository"
      );
    }
  }
  async findAllDirectory(parameters) {
    try {
      const minFileSize = parseInt(parameters.minFileSize);
      const maxFileSize = parseInt(parameters.maxFileSize);
      const fileType = parameters.fileType;
      const isRecursive = parameters.isRecursive === "true";
      let cypherQuery = `
      MATCH (dir:Directory)
      `;

      if (isRecursive === "true") {
        cypherQuery += `
        OPTIONAL MATCH (dir)-[:CONTAINS*]->(file:File)
        `;
      } else {
        cypherQuery += `
        OPTIONAL MATCH (dir)-[:CONTAINS]->(file:File)
        `;
      }

      const queryParams = {};

      if (minFileSize) {
        cypherQuery += `
        WHERE file.size >= $minFileSize
        `;
        queryParams.minFileSize = parseInt(minFileSize);
      }

      if (maxFileSize) {
        cypherQuery += `
        ${minFileSize ? "AND" : "WHERE"} file.size <= $maxFileSize
        `;
        queryParams.maxFileSize = parseInt(maxFileSize);
      }

      if (fileType) {
        cypherQuery += `
        ${minFileSize || maxFileSize ? "AND" : "WHERE"} file.type = $fileType
        `;
        queryParams.fileType = fileType;
      }

      cypherQuery += `
      RETURN dir
    `;

      const result = await neo4jSession.run(cypherQuery, queryParams);
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the directory repository layer",
        "error occured while finding all the repository"
      );
    }
  }
  async createDirectory(name, parentPath, childPath) {
    try {
      const createdAt = new Date().toISOString();
      const result = await neo4jSession.run(
        "MERGE (parent:Directory {path: $parentPath}) " +
          "MERGE (child:Directory {path: $childPath}) " +
          "ON CREATE SET child.name = $name, child.createdAt = $createdAt " +
          "MERGE (parent)-[:CONTAINS]->(child)",
        { parentPath, name, childPath, createdAt }
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the directory repository layer",
        "error occured while creating repository"
      );
    }
  }

  async deleteDirectory(path) {
    try {
      const result = await neo4jSession.run(
        "MATCH (directory:Directory {path: $path}) " +
          "DETACH DELETE directory " +
          "RETURN directory, count(*) AS deletedCount",
        { path }
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the directory repository layer",
        "error occured while deleting repository"
      );
    }
  }
}

module.exports = DirectoryRepository;
