"use strict";

// Constants
const PORT = 8080;
const HOST = "0.0.0.0";

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

app.use(cors());

app.get("/hello", (req, res) => {
  res.send("Hello World");
});

app.get("/", (req, res) => {
  res.send("go to /weather/london or /weather/woodstock to see weather");
});

const WOODSTOCK = `http://api.openweathermap.org/data/2.5/weather?q=Woodstock,us&APPID=${process.env.APP_ID}`;

app.get("/weather/woodstock", (req, res) => {
  axios
    .get(WOODSTOCK)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

const LONDON = `http://api.openweathermap.org/data/2.5/weather?q=london,uk&APPID=${process.env.APP_ID}`;

app.get("/weather/london", (req, res) => {
  axios
    .get(LONDON)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
