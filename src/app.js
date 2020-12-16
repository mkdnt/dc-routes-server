require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const routeRouter = require('./routes/route-router')
const dcAreaRouter = require('./dc_area/dc-area-router')

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

const app = express();
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/route', routeRouter)


app.use('/api/dc_area', dcAreaRouter)
//app.use('/api/distance', distanceRouter)
app.use('/api/difficulty', difficultyRouter)
app.use('/api/route_type', routeTypeRouter)


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error("error");
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
