const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => console.log("MangoDB is ready!"));
mongoose.connection.on("error", (err) => console.error("error--->", err));

async function connectMongoDb() {
  await mongoose.connect(MONGO_URL);
}
async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongoDb,
  mongoDisconnect,
};
