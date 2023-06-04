const { StatusCodes } = require("http-status-codes");
const FileService = require("../service/fileService");
const BadRequestError = require("../util/error/badRequestError");

const fileService = new FileService();

const httpCreateFile = async (req, res) => {
  try {
    // check whether there are required parameters or not ..
    const { directoryPath, fileName, fileSize } = req.body;
    if (!directoryPath || !fileName || !fileSize) {
      throw new BadRequestError(
        "something went wrong",
        "required parameters are missing kindly check"
      );
    }
    // check whether the file already exists
    const filePath = `${directoryPath}/${fileName}`;
    const ifExist = await fileService.findFile(`${directoryPath}/${fileName}`);
    console.log(ifExist, filePath);
    if (ifExist) {
      throw new BadRequestError(
        "something went wrong",
        "file with requested path already exists"
      );
    }
    // now create the file with the required parameters
    const result = await fileService.createFile(
      directoryPath,
      fileName,
      fileSize
    );

    return res.status(StatusCodes.OK).send({
      data: result,
      message: "file created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};

const httpDeleteFile = async (req, res) => {
  const { filePath } = req.body;
  try {
    // check whether path parameter exist in the requestbody
    if (!filePath)
      throw new BadRequestError(
        "parameters are missing",
        "path parameter is missing"
      );

    // check whether the file exists
    const ifExist = await fileService.findFile(filePath);
    if (!ifExist) {
      throw new BadRequestError(
        "something went wrong",
        "file with requested path doesnt exists"
      );
    }
    // now delete the requested file
    const result = await fileService.deleteFile(filePath);
    return res.status(200).send({
      data: ifExist,
      message: "file deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};

const httpCutFile = async (req, res) => {
  try {
    const { filePath, destinationDirectoryPath } = req.body;

    // check whether the parameters exist in the request body
    if (!filePath || !destinationDirectoryPath) {
      throw new BadRequestError(
        "parameters are missing",
        "filePath or destinationDirectoryPath parameters are missing"
      );
    }

    // check whether that file exists or not
    const ifExist = await fileService.findFile(filePath);
    if (!ifExist) {
      throw new BadRequestError(
        "something went wrong",
        "file with requested path doesnt exists"
      );
    }

    const result = await fileService.cutFile(
      filePath,
      destinationDirectoryPath
    );
    return res.status(StatusCodes.OK).send({
      data: result,
      message: "file is cut and pasted succesfully in the destination",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};

httpCopyFile = async (req, res) => {
  try {
    const { filePath, destinationDirectoryPath } = req.body;
    // check whether the parameters exist in the request body
    if (!filePath || !destinationDirectoryPath) {
      throw new BadRequestError(
        "parameters are missing",
        "filePath or destinationDirectoryPath parameters are missing"
      );
    }

    // check whether that file exists or not
    const ifExist = await fileService.findFile(filePath);
    if (!ifExist) {
      throw new BadRequestError(
        "something went wrong",
        "file with requested path doesnt exists"
      );
    }

    const result = await fileService.copyFile(
      filePath,
      destinationDirectoryPath
    );
    return res.status(StatusCodes.OK).send({
      data: result,
      message: "file is copied and pasted succesfully in the destination",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};

const httpGetAllFiles = async (req, res) => {
  try {
    const parameters = req.query;
    const result = await fileService.findAllFiles(parameters);

    return res.status(StatusCodes.OK).send({
      data: result,
      message: "fetched all the files successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};

const httpUpdateFile = async (req, res) => {
  try {
    const { filePath } = req.body;
    // check whether the required parameters are there in req body or not
    if (!filePath) {
      throw new BadRequestError(
        "parameters are missing",
        "filePath parameters are missing"
      );
    }

    const result = await fileService.updateFile(filePath, req.body);
    return res.status(StatusCodes.OK).send({
      data: result,
      message: "updated the file successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};

module.exports = {
  httpCreateFile,
  httpDeleteFile,
  httpCutFile,
  httpCopyFile,
  httpGetAllFiles,
  httpUpdateFile,
};
