const fs = require("fs");
const path = require("path");

const { parse } = require("csv-parse");

const planets = require("./planets.mongo");

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true }
    );
  } catch (err) {
    console.error(`Could not save planet : ${err}`);
  }
}

async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 });
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (record) => {
        if (
          record.koi_disposition === "CONFIRMED" &&
          record.koi_insol >= 0.36 &&
          record.koi_insol <= 1.11 &&
          record.koi_prad <= 1.6
        ) {
          await savePlanet(record);
        }
      })
      .on("end", async () => {
        const habitablePlanets = await getAllPlanets();
        console.log(`${habitablePlanets.length} habitable planets found!`);
        resolve();
      })
      .on("error", (err) => reject(err));
  });
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
