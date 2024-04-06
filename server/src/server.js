const http = require("http");

const app = require("./app");
const { connectMongoDb } = require("./services/mongo.js");
const { loadPlanetsData } = require("./models/planets.model.js");
const { loadLaunchesData } = require("./models/launches.model.js");

const server = http.createServer(app);

const PORT = process.env.PORT || 8080;

async function startServer() {
  await connectMongoDb();
  await loadPlanetsData();
  await loadLaunchesData();
  server.listen(PORT, () => console.log(`Listening on PORT ${PORT}...`));
}

startServer();
