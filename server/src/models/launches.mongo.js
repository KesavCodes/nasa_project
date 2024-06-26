const mongoose = require("mongoose");

const launchesSchema = new mongoose.Schema({
  flightNumber: {
    type: Number,
    required: true,
    // default: 101,
    // min:100,
    // max:999
  },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  launchDate: { type: Date, required: true },
  //   target: { type: mongoose.Schema.ObjectId, ref: "Planets" },
  target: { type: String, required: true },
  customers: [String],
  upcoming: { type: Boolean, required: true },
  success: { type: Boolean, required: true, default: true },
});

// Connects launchesSchema with the "launches" collection
module.exports = mongoose.model("Launch", launchesSchema);
