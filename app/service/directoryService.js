const { DirectoryRepository } = require("../repository");
const ServiceError = require("../util/error/serviceError");

const directoryRepository = new DirectoryRepository();
class DirectoryService {
  async createDirectory(path) {
    try {
      // split the path
      const directories = path.split("/").filter((dir) => dir !== "");
      let currentPath = "";
      // iterate over the path and create any missing directories..
      for (const directory of directories) {
        currentPath += `/${directory}`;
        const parentPath = currentPath.slice(0, currentPath.lastIndexOf("/"));
        await directoryRepository.createDirectory(
          directory,
          parentPath,
          currentPath
        );
      }
    } catch (error) {
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the directory service layer",
        "error occured while creating the directory"
      );
    }
  }
  async findAllDirectories(parameters) {
    try {
      const result = await directoryRepository.findAllDirectory(parameters);
      const directories = result.records.map(
        (record) => record.get("dir").properties
      );
      return directories;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the directory service layer",
        "error occured while finding all the directories"
      );
    }
  }
  async findDirectory(path, parameter) {
    try {
      const result = await directoryRepository.findDirectory(path, parameter);
      const record = result.records[0];

      const directory = record.get("dir").properties;
      const files = record.get("files").map((file) => file.properties);
      const directories = record
        .get("directories")
        .map((dir) => dir.properties);
      const fileCount = record.get("fileCount").toNumber();
      const directoryCount = record.get("directoryCount").toNumber();

      let dirObj = {
        directory,
        files,
        directories,
        fileCount,
        directoryCount,
      };
      if (parameter.isRecursive) {
        const subFiles = record
          .get("subFiles")
          .map((subFile) => subFile.properties);
        const subFileCount = record.get("subFileCount").toNumber();
        dirObj = {
          ...dirObj,
          subFiles,
          subFileCount,
        };
      }
      return result.records.length > 0 ? dirObj : undefined;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the directory service layer",
        "error occured while finding the directory"
      );
    }
  }
  async deleteDirectory(path) {
    try {
      const result = await directoryRepository.deleteDirectory(path);
      const deletedCount = result.records[0].get("deletedCount").toNumber();
      const deletedDirectory = result.records[0].get("directory").properties;

      const deleteObj = {
        deletedCount,
        deletedDirectory,
      };
      return deleteObj;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the directory service layer",
        "error occured while deleting the directory"
      );
    }
  }
}

module.exports = DirectoryService;
