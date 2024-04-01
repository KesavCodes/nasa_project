const express = require("express");

const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunchWithId,
} = require("./launches.controller.js");

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);

launchesRouter.post("/", httpAddNewLaunch);

launchesRouter.delete("/:id", httpAbortLaunchWithId);

module.exports = launchesRouter;
