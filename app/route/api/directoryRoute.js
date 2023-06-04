const express = require("express");
const {
  httpCreateDirectory,
  httpDeleteDirectory,
  httpGetDirectory,
  httpGetAllDirectories,
} = require("../../controller/directoryController");

const directoryRouter = express.Router();

// POST /host/api/directories
// payload path : string ex : /root/svu/cse/12006051 etc ..
directoryRouter.post("/", httpCreateDirectory);

// Get /host/api/directories/info
// payload path : String /root/svu/cse/12006051 etc ..
directoryRouter.get("/info", httpGetDirectory);

// Get /host/api/directories
// QueryParameter minFileSize , maxFileSize , fileType , isRecursive

directoryRouter.get("/", httpGetAllDirectories);

// DELETE /host/api/directories
// payload path : string ex : /root/svu/cse/12006051 etc..
directoryRouter.delete("/", httpDeleteDirectory);

module.exports = directoryRouter;
