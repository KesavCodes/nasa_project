const {
  getAllLaunches,
  addNewLaunch,
  abortLaunchWithId,
} = require("../../models/launches.model.js");


async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches(req.query));
}

async function httpAddNewLaunch(req, res) {
  const launchData = req.body;
  if (
    !launchData.mission ||
    !launchData.rocket ||
    !launchData.launchDate ||
    !launchData.target
  ) {
    return res.status(400).json({
      ok: false,
      message: "Missing required launch property.",
    });
  }
  launchData.launchDate = new Date(launchData.launchDate);
  if (launchData.launchDate.toString() === "Invalid Date") {
    return res.status(400).json({
      ok: false,
      message: "Invalid date.",
    });
  }
  const dbResponse = await addNewLaunch(launchData);
  if (!dbResponse) {
    return res.status(400).json({
      ok: false,
      message: "Something went wrong! Not able to add launch!",
    });
  }
  return res.status(201).json(launchData);
}

async function httpAbortLaunchWithId(req, res) {
  const abortedLaunchData = await abortLaunchWithId(Number(req.params.id));
  if (!abortedLaunchData || abortedLaunchData.modifiedCount !== 1) {
    return res.status(400).json({
      ok: false,
      message: "Something went wrong. Couldn't able to process this request.",
    });
  }
  return res.status(200).json({
    ok: true,
    message: "Launch aborted successfully!",
  });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunchWithId,
};
