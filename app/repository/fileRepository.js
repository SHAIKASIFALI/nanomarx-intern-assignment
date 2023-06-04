const { neo4jSession } = require("../database");
const RepositoryError = require("../util/error/repositoryError");

class FileRepository {
  async createFile(
    directoryPath,
    fileName,
    fileType,
    filePath,
    size,
    createdAt
  ) {
    try {
      const result = neo4jSession.run(
        "MERGE (parent:Directory {path: $directoryPath}) " +
          "MERGE (file:File {name: $fileName ,filePath : $filePath }) " +
          "SET file.fileType = $fileType,  file.createdAt = $createdAt , file.filePath = $filePath , file.size = $size " +
          "MERGE (parent)-[:CONTAINS]->(file) " +
          "RETURN file",
        {
          directoryPath,
          fileName,
          fileType,
          createdAt,
          filePath,
          size,
        }
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the file repository layer",
        "there was problem in creating the file"
      );
    }
  }

  async deleteFile(path) {
    try {
      const result = await neo4jSession.run(
        "MATCH (file:File {filePath: $filePath}) " +
          "DETACH DELETE file " +
          "RETURN file, count(*) AS deletedCount",
        { filePath: path }
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the file repository layer",
        "there was problem in deleting the file"
      );
    }
  }

  async findFile(path) {
    try {
      const result = await neo4jSession.run(
        "MATCH (f:File {filePath: $path}) RETURN f",
        { path: path }
      );
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the file repository layer",
        "there was problem in finding the file"
      );
    }
  }

  async findAllFiles(parameters) {
    try {
      const minFileSize = parseInt(parameters.minSize);
      const maxFileSize = parseInt(parameters.maxSize);
      const fileType = parameters.type;

      let query = "MATCH (file:File) ";
      let queryParams = {};

      if (!isNaN(minFileSize) && !isNaN(maxFileSize)) {
        query +=
          "WHERE file.size >= $minFileSize AND file.size <= $maxFileSize ";
        queryParams.minFileSize = minFileSize;
        queryParams.maxFileSize = maxFileSize;
      } else if (!isNaN(minFileSize)) {
        query += "WHERE file.size >= $minFileSize ";
        queryParams.minFileSize = minFileSize;
      } else if (!isNaN(maxFileSize)) {
        query += "WHERE file.size <= $maxFileSize ";
        queryParams.maxFileSize = maxFileSize;
      }

      if (fileType) {
        if (query.includes("WHERE")) {
          query += "AND file.fileType = $fileType ";
        } else {
          query += "WHERE file.fileType = $fileType ";
        }
        queryParams.fileType = fileType;
      }

      query += "RETURN file";

      const result = await neo4jSession.run(query, queryParams);
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the file repository layer",
        "there was problem in fetching all the the files"
      );
    }
  }

  async updateFile(parameters, filePath) {
    try {
      const { fileName, fileSize } = parameters;
      let cypherQuery = "MATCH (file:File {filePath: $filePath}) ";
      const cypherParams = { filePath };

      if (fileName) {
        const fileType = fileName.split(".").pop().toLowerCase();
        cypherQuery +=
          "SET file.name = $fileName, file.filePath = replace(file.filePath, file.name, $fileName), " +
          "    file.fileType = $fileType ";
        cypherParams.fileName = fileName;
        cypherParams.fileType = fileType;
      }

      if (fileSize !== undefined) {
        cypherQuery += "SET file.size = $fileSize ";
        cypherParams.fileSize = fileSize;
      }

      cypherQuery += "RETURN file";

      const result = await neo4jSession.run(cypherQuery, cypherParams);
      console.log(cypherQuery, result);
      return result;
    } catch (error) {
      console.log(error);
      throw new RepositoryError(
        "error occured in the file repository layer",
        "there was problem in updating the file"
      );
    }
  }
}

module.exports = FileRepository;
