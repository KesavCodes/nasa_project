const express = require("express");

const planetsRouter = require("./planets/planets.router.js");
const launchesRouter = require("./launches/launches.router.js");

const v1ApiRouter = express.Router();

v1ApiRouter.use("/planets", planetsRouter);
v1ApiRouter.use("/launches", launchesRouter);

module.exports = v1ApiRouter;
