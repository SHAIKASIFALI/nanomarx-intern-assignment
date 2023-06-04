const { FileRepository } = require("../repository");
const BadRequestError = require("../util/error/badRequestError");
const NotFoundError = require("../util/error/notFoundError");
const DirectoryService = require("./directoryService");
const fileRepository = new FileRepository();
const directoryService = new DirectoryService();
class FileService {
  async createFile(directoryPath, fileName, size) {
    try {
      const fileType = fileName.split(".").pop().toLowerCase();
      const createdAt = new Date().toISOString();
      const filePath = directoryPath + "/" + fileName;
      // first create the directories in the cirectory path if they are missing
      await directoryService.createDirectory(directoryPath);
      // now create the file once directories are created
      const result = await fileRepository.createFile(
        directoryPath,
        fileName,
        fileType,
        filePath,
        size,
        createdAt
      );
      const createdFile = result.records[0].get("file").properties;
      return createdFile;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the file service layer",
        "error occured while creating the file"
      );
    }
  }

  async deleteFile(path) {
    try {
      const result = await fileRepository.deleteFile(path);
      const deletedFile = result.records[0].get("file").properties;
      return deletedFile;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the file service layer",
        "error occured while deleting the file"
      );
    }
  }

  async findFile(path) {
    try {
      const result = await fileRepository.findFile(path);
      return result.records.length > 0
        ? result.records[0].get("f").properties
        : undefined;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the file service layer",
        "error occured while finding the file"
      );
    }
  }

  async findAllFiles(parameters) {
    try {
      const result = await fileRepository.findAllFiles(parameters);
      const files = result.records.map(
        (record) => record.get("file").properties
      );
      return files;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the file service layer",
        "error occured while fetching the file"
      );
    }
  }
  async cutFile(filePath, destinationDirectoryPath) {
    try {
      // get the file
      const file = await this.findFile(filePath);
      console.log(file);

      // now delete the file
      await this.deleteFile(filePath);

      // now create the new file in the destination directory
      const result = this.createFile(
        destinationDirectoryPath,
        file.name,
        file.size
      );
      return result;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the file service layer",
        "error occured while finding the file"
      );
    }
  }

  async copyFile(filePath, destinationDirectoryPath) {
    try {
      // get the file
      const file = await this.findFile(filePath);
      // now create the new file in the destination directory
      const result = this.createFile(
        destinationDirectoryPath,
        file.name,
        file.size
      );
      return result;
    } catch (error) {
      console.log(error);
      if (error.name === "RepositoryError") throw error;
      throw new ServiceError(
        "error occured in the file service layer",
        "error occured while finding the file"
      );
    }
  }

  async updateFile(path, parameters) {
    try {
      // check whether the particular file actually exist
      const ifFileExist = await this.findFile(path);
      if (!ifFileExist) {
        throw new NotFoundError(
          "file not found",
          "the required file is missing"
        );
      }
      if (parameters.fileName) {
        // check whether the file with this name already exists in the directory
        const parentDirectoryPath = path.substring(0, path.lastIndexOf("/"));
        const ifNameExist = await this.findFile(
          `${parentDirectoryPath}/${parameters.fileName}`
        );

        if (ifNameExist) {
          throw new BadRequestError(
            "the file name already exists ",
            "the file with the given name already exists in the parent directory"
          );
        }
      }

      // if file is present and no name clashes then update the file ..
      const result = await fileRepository.updateFile(parameters, path);
      console.log(result);
      const updatedFile = result.records[0].get("file").properties;
      return updatedFile;
    } catch (error) {
      console.log(error);
      if (
        error.name === "RepositoryError" ||
        error.name === "NotFoundError" ||
        error.name === "BadRequestError"
      )
        throw error;
      throw new ServiceError(
        "error occured in the file service layer",
        "error occured while updating the file"
      );
    }
  }
}

module.exports = FileService;
