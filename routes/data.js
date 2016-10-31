const router                         = require("express").Router();
const { getUserByIdMW }              = require("../models/user");
const { deleteEntry }                = require("../models/favorites");
const { getOpenWeatherData }         = require("../services/openWeather");
const { getSunsetWXData }            = require("../services/sunsetwx");
const { getDarkSkyData }             = require("../services/darksky");
const { getWeatherUndergroundData }  = require("../services/weatherUnderground");
const { getSunsetTimeData }          = require("../services/sunsetTime");
const { getAirNowData }              = require("../services/airnow");
const { getForecastGovData }         = require("../services/forecastGov");
const { getAerisData }               = require("../services/aeris");
const { loadData, storeData }        = require("../lib/weatherAlgorithm");

router.get("/", getUserByIdMW, getOpenWeatherData, getSunsetWXData, getDarkSkyData, getWeatherUndergroundData, getSunsetTimeData, getAirNowData, getForecastGovData, getAerisData, loadData, storeData, (req,res) => {
  // console.log("Data root user - ", res.user);
  res.render("data", {
    imgSrc : res.dataObj.imgSrc,
    chanceLabel : res.dataObj.chanceInnerHTML,
  });
  // res.json([
  //   {ow: res.openWeatherData},
  //   {sw: res.sunsetWxData},
  //   {ds: res.darkSkyData},
  //   {wu: res.weatherUndergroundData.hourly_forecast},
  //   {st: res.sunsetTimeData},
  //   {an: res.airNowData},
  //   {fg: res.forecastGovData},
  //   {ae: res.aerisData}
  // ]);
});

router.get("/getData", (req,res) => {
  res.redirect("/");
});

router.delete("/removeData/:id", deleteEntry, (req,res) => {
  res.redirect("/users/profile")
});

router.post("/postData", (req,res) => {
  //get hidden data
  //send to mongo
  res.redirect("/data")
});

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
