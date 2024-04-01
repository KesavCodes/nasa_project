const express = require("express");
const path = require("path");

const cors = require("cors");
const morgan = require("morgan");

const homeController = require("./routes/home/home.controller.js");
const v1ApiRouter = require("./routes/v1.api.js");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/v1", v1ApiRouter);
/* This code is not needed in modern express application. When we serve static files from express, for "/" route, it will 
automatically look for 'index.html' in the served 'public' directory. */
app.get("/*", homeController.home);

module.exports = app;
