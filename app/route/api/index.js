// this is the api router where every route is routed to their respective routers

const express = require("express");
const directoryRouter = require("./directoryRoute");
const fileRouter = require("./fileRoute");

const apiRouter = express.Router();

// this routes to the directoryRouter
apiRouter.use("/directories", directoryRouter);

// this routes to the fileRouter
apiRouter.use("/files", fileRouter);

module.exports = apiRouter;
