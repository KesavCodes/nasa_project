const mongoose = require("mongoose");

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

// Connects planetsSchema with the "planets" collection -> converts Name given to collection name by making it lowercase and plural.
module.exports = mongoose.model("Planet", planetsSchema);
