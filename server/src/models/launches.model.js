const axios = require("axios");

const launchesDatabase = require("./launches.mongo");
const planetsDatabase = require("./planets.mongo");
const { getPagination } = require("../utils/query.js");

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_QUERY_URL = "https://api.spacexdata.com/v4/launches/query";
const requestBody = {
  query: {},
  options: {
    select: {
      flight_number: 1,
      name: 1,
      rocket: 1,
      date_local: 1,
      payloads: 1,
      upcoming: 1,
      success: 1,
    },
    pagination: false,
    populate: [
      {
        path: "rocket",
        select: {
          name: 1,
        },
      },
      {
        path: "payloads",
        select: {
          customers: 1,
        },
      },
    ],
  },
};

/* 
-- LaunchData - SpaceX API mapping --
flightNumber: flight_number,
mission: name,
rocket: rocket.name,
launchDate: date_local,
target: -NA-,
customers: payloads.customers
upcoming: upcoming,
success: success 
*/
async function loadLaunchesData() {
  const spacexDataInDb = await findLaunch({
    flightNumber: 1,
    mission: "FalconSat",
    rocket: "Falcon 1",
  });
  if (spacexDataInDb) {
    console.log("Launches data not refreshed!");
    return;
  }
  try {
    const response = await axios.post(SPACEX_QUERY_URL, requestBody);
    const responseData = response.data.docs;
    responseData.forEach(async (record) => {
      const launchData = {
        flightNumber: record.flight_number,
        mission: record.name,
        rocket: record.rocket.name,
        launchDate: record.date_local,
        target: "Kepler-442 b",
        customers: record.payloads?.flatMap((payload) => payload.customers),
        upcoming: record.upcoming,
        success: record.success,
      };
      await saveLaunch(launchData);
    });
    console.log("Launches data refreshed!");
  } catch (err) {
    console.error("error ->", err.code);
  }
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function getLaunchById(flightId) {
  return await findLaunch({ flightNumber: flightId });
}

async function getAllLaunches(query) {
  
  const { skip, limit } = getPagination(query);

  return await launchesDatabase
    .find({}, { _id: 0, __v: 0 })
    .sort("flightNumber")
    .skip(skip)
    .limit(limit);
}

async function getMaxFlightNumber() {
  const flight = await launchesDatabase.findOne().sort("-flightNumber");
  return flight ? flight.flightNumber : DEFAULT_FLIGHT_NUMBER;
}

async function saveLaunch(launchData) {
  try {
    const planet = await planetsDatabase.findOne({
      keplerName: launchData.target,
    });
    if (!planet) {
      throw new Error("Could not able to find the selected planet");
    }
    return await launchesDatabase.updateOne(
      { flightNumber: launchData.flightNumber },
      launchData,
      { upsert: true }
    );
  } catch (err) {
    console.log(`Couldn't save the launch data : ${err}`);
  }
}

async function addNewLaunch(launchData) {
  const latestFlightNumber = await getMaxFlightNumber();
  return await saveLaunch({
    ...launchData,
    flightNumber: latestFlightNumber + 1,
    customers: ["JL", "NASA"],
    upcoming: true,
    success: true,
  });
}

async function abortLaunchWithId(flightId) {
  const abortedLaunch = await getLaunchById(flightId);
  if (!abortedLaunch) {
    return false;
  }
  abortedLaunch.upcoming = false;
  abortedLaunch.success = false;
  return await saveLaunch(abortedLaunch);
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  addNewLaunch,
  abortLaunchWithId,
};
