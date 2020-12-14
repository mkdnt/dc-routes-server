require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const RoutesService = require('./routes/routes-service')

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

const app = express();
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

// app.use("/anendpoint", someRouter);

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!')
});

app.get('/route', (req, res, next) => {
  const knexInstance = req.app.get('db')
  RoutesService.getAllRoutes(knexInstance)
    .then(routes => {
      res.json(routes)
    })
    .catch(next)
})

app.get('/route/:route_id', (req, res, next) => {
  const knexInstance = req.app.get('db')
  RoutesService.getById(knexInstance, req.params.route_id)
    .then(route => {
      if (!route) {
        return res.status(404).json({
          error: { message: `Route doesn't exist` }
        })
      }
      res.json(route)
    })
    .catch(next)
})

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
