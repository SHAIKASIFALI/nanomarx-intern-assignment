// initialisation of the express application
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const apiRouter = require("./route/api");

const app = express();

app.use(cors()); // to allow cross origin request
app.use(bodyParser.json()); // to parse the request body

// configuring base url for the api
app.use("/api", apiRouter);

module.exports = app;
