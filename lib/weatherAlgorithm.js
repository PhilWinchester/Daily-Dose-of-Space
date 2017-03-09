const { ObjectID } = require('mongodb');
const { getDB }    = require('../lib/dbConnect.js');

//load in data from API Fetches
function loadData(req,res,next) {
  const weatherData = {};
  const weightedData = {};
  const sunsetTime = {};

  weatherData.ow = res.openWeatherData;
  weatherData.sw = res.sunsetWxData;
  weatherData.ds = res.darkSkyData;
  weatherData.wu = res.weatherUndergroundData;
  weatherData.st = res.sunsetTimeData;
  weatherData.an = res.airNowData;
  weatherData.fg = res.forecastGovData;
  weatherData.ae = res.aerisData;

  validateData(weatherData, weightedData, sunsetTime);
  let heuristicValues = heuristicVals(weightedData);
  // console.log("Weather algorithm user - ", req.body);
  res.dataObj = calculateSunset(req.body, heuristicValues.heuristicCloudCoverage, heuristicValues.heuristicAirQuality);
  next();
}

//function to validate all data brought in from Ajax
function validateData(weatherData, weightedData, sunsetTime){
  if (weatherData.ow) {
    evalOpenWeatherData(weatherData.ow, weightedData);
  };
  if (weatherData.sw) {
    evalSunsetwxData(weatherData.sw, weightedData);
  };
  if (weatherData.ds) {
    evalDarkSkyData(weatherData.ds, weightedData);
  };
  if (weatherData.wu) {
    evalWeatherUndergroundData(weatherData.wu, weightedData);
  };
  if (weatherData.st) { //-/+ timezones
    let d = new Date();
    d = d.getTimezoneOffset()/60;
    sunsetTime.time = {time : weatherData.st.results.sunset, timezoneOffset : d};
  };
  if (weatherData.an) {
    evalAirNowData(weatherData.an, weightedData)
  };
  if (weatherData.fg) {
    evalForecastGovData(weatherData.fg, weightedData );
  };
  if (weatherData.ae) {
    evalAerisData(weatherData.ae, weightedData);
  };
  // heuristicVals();
};

//each eval function grabs the data needed and adds to new object
function evalOpenWeatherData(data, weightedData) {
  // console.log(parseInt(data.clouds.all));
  let weightedVal = {value : parseInt(data.clouds.all), weight: 2};
  weightedData.ow = weightedVal;
};

function evalSunsetwxData(data, weightedData) {
  console.log(data);
  data.features.forEach(feature => {
    console.log(feature);
  })
};

function evalDarkSkyData(data, weightedData){
  // console.log(data.minutely.data);
  // console.log(data.hourly.data);
  let cloudCoverTotal = 0;
  for (let i = 0; i < 6; i++) { //parseInt makes an int not float
    cloudCoverTotal += parseInt(data.hourly.data[i].cloudCover * 100);
  }
  cloudCoverTotal = (cloudCoverTotal / 6);
  let weightedVal = {value : cloudCoverTotal, weight : 2}
  weightedData.ds = weightedVal;
};

//WEIGHT THE MORE RECENT VALUES MORE

function evalWeatherUndergroundData(data, weightedData){
  // console.log(data[0].condition);
  let cloudCoverTotal = 0;
  for (let i = 0; i < 6; i++) {
    // console.log(data.hourly_forecast);
    cloudCoverTotal += parseInt(data.hourly_forecast[i].sky);
  };
  cloudCoverTotal = (cloudCoverTotal / 6);
  let weightedVal = {value : cloudCoverTotal, weight : 2};
  weightedData.wu = weightedVal;
};

function evalAirNowData(data, weightedData){
  let aqiTotal = 0;
  //data is gathered twice a day
  for (let i = 0; i < data.length; i++) {
    aqiTotal += parseInt(data[i].AQI);
  };
  aqiTotal = aqiTotal / data.length;
  let weightedVal = {value : aqiTotal, weight : 1};
  weightedData.an = weightedVal;
};

//create my own valuation of percent cloud coverage
function evalForecastGovData(data, weightedData){
  // console.log(data.currentobservation.Weather);

  let cloudCoverTotal = 0;
  for (var i = 0; i < data.data.weather.length; i++) {
    if (data.data.weather[i].toLowerCase() === "mostly sunny") {
      cloudCoverTotal += 1;
    } else if (data.data.weather[i].toLowerCase() === "partly sunny") {
      cloudCoverTotal += 2;
    } else if (data.data.weather[i].toLowerCase() === "partly cloudy") {
      cloudCoverTotal += 3;
    } else if (data.data.weather[i].toLowerCase() === "mostly cloudy") {
      cloudCoverTotal += 4;
    } else if (data.data.weather[i].toLowerCase() === "cloudy") {
      cloudCoverTotal += 5;
    };
    cloudCoverTotal = cloudCoverTotal / data.data.weather.length;
  };
  let weightedVal = {value : cloudCoverTotal * 100, weight : 4};
  weightedData.fg = weightedVal;
};

function evalAerisData(data, weightedData){
  // console.log(data.response[0]);
  let weightedVal = {value : parseInt(data.response[0].ob.sky), weight : 2};
  weightedData.ae = weightedVal;
};

//averaging out each weather data with their equivalent weights
function heuristicVals(weightedData){
  // console.log("Weighted Data - ", weightedData);

  let sunsetVal = 0;
  for (key in weightedData) {
    if (key != "an") {
      sunsetVal += weightedData[key].value / weightedData[key].weight;
    };
  };
  let heuristicCloudCoverage = ((sunsetVal / (Object.keys(weightedData).length)) - 1).toFixed(2);
  let heuristicAirQuality = (weightedData.an.value).toFixed(2);


  return { heuristicCloudCoverage, heuristicAirQuality };
};

//using the cloud coverage and air quality, the average is the sunset percentage
function calculateSunset(user, cloud, air) {

  let cloudCoverage = parseFloat(cloud);
  let airParticles = parseFloat(air);
  let chance = ((cloudCoverage + airParticles) / 2).toFixed(2);

  // console.log(cloudCoverage, airParticles, chance);

  let chanceInnerHTML;
  let imgSrc;

  if (chance < 20) {
    chanceInnerHTML = "Minimal Chance - " + chance + "%";
    imgSrc = "./images/noclouds.png";
  } else if (chance < 40) {
    chanceInnerHTML = "Poor Chance - " + chance + "%";
    imgSrc = "./images/poor.png";
  } else if (chance < 60) {
    chanceInnerHTML = "Good Chance - " + chance + "%";
    imgSrc = "./images/good.png";
  } else if (chance < 80) {
    chanceInnerHTML = "Great Chance - " + chance + "%";
    imgSrc = "./images/great.png";
  } else if (chance < 100) {
    chanceInnerHTML = "Too many Clouds - " + chance + "%";
    imgSrc = "./images/cloudy.png";
  } else {
    chanceInnerHTML = "The Air Quality Index is too high. You should stay inside - " + chance + "%";
  };

  let dataObj = { chance: chance, clouds: cloudCoverage, air: airParticles, position: {lat: user.latitude, long: user.longitude}}

  return {dataObj, chanceInnerHTML, imgSrc};
};

//inserts data to mongoDB
function storeData(req, res, next) {
  // store res.dataObj in your mongoDB
  // after successfully inserting into DB, next();
  res.dataObj.userId = req.session.userId;
  console.log("storing", res.dataObj);

  getDB().then((db) => {
    db.collection('data')
      .insert(res.dataObj, (insertErr, result) => {
        if (insertErr) return next(insertErr);
        res.saved = result;

        db.close();
        next();
      });
      return false;
  });
  return false;

  next();
};

module.exports = {
  loadData,
  storeData
}
