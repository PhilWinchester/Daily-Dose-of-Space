const router                         = require("express").Router();

const { getUserByIdMW }              = require("../models/user");
const { deleteEntry }                = require("../models/favorites");
const { getSunsetToken }             = require("../models/user");

const { getOpenWeatherData }         = require("../services/openWeather");
const { getSunsetWXData }            = require("../services/sunsetwx");
const { getDarkSkyData }             = require("../services/darksky");
const { getWeatherUndergroundData }  = require("../services/weatherUnderground");
const { getSunsetTimeData }          = require("../services/sunsetTime");
const { getAirNowData }              = require("../services/airnow");
const { getForecastGovData }         = require("../services/forecastGov");
const { getAerisData }               = require("../services/aeris");

const { loadData, storeData }        = require("../lib/weatherAlgorithm");

//Main data route - gets userID and then using that will API Fetch with their Long/Lat and then load/store data from those fetches. Displaying them on data.ejs
router.get("/", getUserByIdMW, getOpenWeatherData, getSunsetWXData, getDarkSkyData, getWeatherUndergroundData, getSunsetTimeData, getAirNowData, getForecastGovData, getAerisData, loadData, storeData, (req,res) => {
  res.render("data", {
    imgSrc : res.dataObj.imgSrc,
    chanceLabel : res.dataObj.chanceInnerHTML,
  });
});

//initial implementation used /data/getData and I couldn't fully remove error from this so this path covers that error
router.get("/getData", (req,res) => {
  res.redirect("/");
});

router.delete("/removeData/:id", deleteEntry, (req,res) => {
  res.redirect("/users/profile")
});

router.post("/postData", (req,res) => {
  res.redirect("/data")
});

//Each API's individual route
router.get("/openweather", getOpenWeatherData, (req,res) => {
  res.json(res.openWeatherData);
});

router.get("/sunsetwx", getSunsetWXData, (req,res) => {
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
