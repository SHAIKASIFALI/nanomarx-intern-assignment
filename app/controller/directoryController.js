const DirectoryService = require("../service/directoryService");
const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../util/error/badRequestError");
const NotFoundError = require("../util/error/notFoundError");
const directoryService = new DirectoryService();

const httpCreateDirectory = async (req, res) => {
  const { path } = req.body;

  try {
    // check whether path parameter exist in the requestbody
    if (!path)
      throw new BadRequestError(
        "parameters are missing",
        "path parameter is missing"
      );
    // check whether the directory already exists
    const ifExist = await directoryService.findDirectory(path, {
      isRecursive: true,
    });
    if (ifExist)
      throw new BadRequestError(
        "something went wrong",
        "the directory with given path already exist"
      );
    // create all the directories
    await directoryService.createDirectory(path);
    // fetch the created directory
    const result = await directoryService.findDirectory(path, {
      isRecursive: true,
    });
    return res.status(StatusCodes.OK).send({
      data: result,
      message: "directory created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};
const httpGetDirectory = async (req, res) => {
  try {
    const { path } = req.body;
    const parameter = req.query;
    // check whether the parameter is present or not
    if (!path)
      throw new BadRequestError(
        "parameters are missing",
        "path parameter is missing"
      );

    // check whether the directory already exists
    const ifExist = await directoryService.findDirectory(path, parameter);
    if (!ifExist)
      throw new NotFoundError(
        "something went wrong",
        "the directory with given path already exist"
      );

    return res.status(StatusCodes.OK).send({
      data: ifExist,
      message: `details about the given directory is found`,
      success: true,
    });
  } catch (error) {
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};
const httpDeleteDirectory = async (req, res) => {
  try {
    const { path } = req.body;
    // check whether path parameter exist in the requestbody
    if (!path)
      throw new BadRequestError(
        "parameters are missing",
        "path parameter is missing"
      );

    // check whether the directory with given path exists
    const ifExist = await directoryService.findDirectory(path, {
      isRecursive: true,
    });
    if (!ifExist)
      throw new BadRequestError(
        "something went wrong",
        "the directory with given path doesnt exist"
      );

    await directoryService.deleteDirectory(path);
    return res.status(200).send({
      success: true,
      data: ifExist,
      msg: "successfully deleted the directory",
    });
  } catch (error) {
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};

const httpGetAllDirectories = async (req, res) => {
  try {
    const parameters = req.query;
    const result = await directoryService.findAllDirectories(parameters);

    return res.status(StatusCodes.OK).send({
      data: result,
      message: "successfully fetched all the directory details",
      success: true,
    });
  } catch (error) {
    return res.status(error.statusCode).send({
      success: false,
      message: error.message,
      explanation: error.explanation,
    });
  }
};

module.exports = {
  httpCreateDirectory,
  httpDeleteDirectory,
  httpGetDirectory,
  httpGetAllDirectories,
};
