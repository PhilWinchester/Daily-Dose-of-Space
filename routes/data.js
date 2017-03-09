const router                            = require("express").Router();

const { getUserByIdMW }                 = require("../models/user");
const { deleteEntry, updateEntry, getEntry } = require("../models/favorites");
const { getSunsetToken }                = require("../models/user");

const { getOpenWeatherData }            = require("../services/openWeather");
const { sunsetwxLogin, getSunsetWXData } = require("../services/sunsetwx");
const { getDarkSkyData }                = require("../services/darksky");
const { getWeatherUndergroundData }     = require("../services/weatherUnderground");
const { getSunsetTimeData }             = require("../services/sunsetTime");
const { getAirNowData }                 = require("../services/airnow");
const { getForecastGovData }            = require("../services/forecastGov");
const { getAerisData }                  = require("../services/aeris");
const { getLatLongByZip, getLatLongByCity } = require("../services/latlongHelper")

const { loadData, storeData }           = require("../lib/weatherAlgorithm");

//Main data route - gets userID and then using that will API Fetch with their Long/Lat and then load/store data from those fetches. Displaying them on data.ejs
router.post("/", getOpenWeatherData, getDarkSkyData, getWeatherUndergroundData, getSunsetTimeData, getAirNowData, getForecastGovData, getAerisData, loadData, storeData, (req,res) => {
  console.log(req.body.fetchPos);
  res.json(res.dataObj);
});

router.post("/zipcodes", getLatLongByZip, (req,res) => {
  console.log("Zipcode route hit", req.body);

  res.json(res.latLongResponse);
});

router.post("/cityname", getLatLongByCity, getLatLongByZip, (req,res) => {
  console.log("Cityname route hit", req.body);

  res.json(res.latLongResponse);
});

//initial implementation used /data/getData and I couldn't fully remove error from this so this path covers that error
router.get("/getData", (req,res) => {
  res.redirect("/");
});

router.get("/editEntry/:id", getEntry,  (req,res) => {
  res.render("rate", { sunset : res.sunset })
});

router.put("/updateEntry/:id", updateEntry, (req,res) => {
  res.redirect("/users/profile")
});

router.delete("/removeData/:id", deleteEntry, (req,res) => {
  res.redirect("/users/profile")
});

router.post("/postData", (req,res) => {
  res.redirect("/data")
});

//Each API's individual route
router.post("/openweather", getOpenWeatherData, (req,res) => {
  res.json(res.openWeatherData);
});

router.get("/sunsetwx", sunsetwxLogin, getSunsetWXData, (req,res) => {
  console.log(res.sunsetWxData.features[0].properties.quality);
  res.json(res.sunsetWxData);
});

router.get("/darksky", getDarkSkyData, (req,res) => {
  res.json(res.darkSkyData);
});

router.get("/weatherunderground", getWeatherUndergroundData, (req,res) => {
  console.log(res.weatherUndergroundData.hourly_forecast[0].sky);
  res.json(res.weatherUndergroundData.hourly_forecast);
});

router.get("/sunsettime", getSunsetTimeData, (req,res) => {
  res.json(res.sunsetTimeData);
});

router.get("/airnow", getAirNowData, (req,res) => {
  res.json(res.airNowData);
});

router.get("/forecastgov", getForecastGovData, (req,res) => {
  res.json(res.forecastGovData);
});

router.get("/aeris", getAerisData, (req,res) => {
  res.json(res.aerisData);
});

module.exports = router;
