document.addEventListener("DOMContentLoaded", () => {
  console.log("Algorithm script loaded");

  const weatherData = {};
  const weightedData = {};
  const sunsetTime = {};

//ajax to fetch data from /data/getData route
  $.ajax({
    url: "/data/getData",
    method: "GET",
    dataType: "json",
  })
  .done((data) => {
    weatherData.ow = data[0].ow;
    weatherData.sw = data[1].sw;
    weatherData.ds = data[2].ds;
    weatherData.wu = data[3].wu;
    weatherData.st = data[4].st;
    weatherData.an = data[5].an;
    weatherData.fg = data[6].fg;
    weatherData.ae = data[7].ae;

    validateData();
  })
  .fail((err) => {
    console.log("Error: " + err);
  });


//function to validate all data brought in from Ajax
  function validateData(){
    if (weatherData.ow) {
      evalOpenWeatherData(weatherData.ow);
    };
    if (weatherData.sw) {
      console.log(weatherData.sw);
    };
    if (weatherData.ds) {
      evalDarkSkyData(weatherData.ds);
    };
    if (weatherData.wu) {
      evalWeatherUndergroundData(weatherData.wu);
    };
    if (weatherData.st) { //-/+ timezones
      let d = new Date();
      d = d.getTimezoneOffset()/60;
      sunsetTime.time = {time : weatherData.st.results.sunset, timezoneOffset : d};
    };
    if (weatherData.an) {
      evalAirNowData(weatherData.an)
    };
    if (weatherData.fg) {
      evalForecastGovData(weatherData.fg);
    };
    if (weatherData.ae) {
      evalAerisData(weatherData.ae);
    };
    heuristicVals();
  };

  function evalOpenWeatherData(data) {
    let weightedVal = {value : parseInt(data.clouds.all), weight: 2};
    weightedData.ow = weightedVal;
  };

  function evalDarkSkyData(data){
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

  function evalWeatherUndergroundData(data){
    // console.log(data[0].condition);
    let cloudCoverTotal = 0;
    for (let i = 0; i < 6; i++) {
      cloudCoverTotal += parseInt(data[i].sky);
    };
    cloudCoverTotal = (cloudCoverTotal / 6);
    let weightedVal = {value : cloudCoverTotal, weight : 2};
    weightedData.wu = weightedVal;
  };

  function evalAirNowData(data){
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
  function evalForecastGovData(data){
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

  function evalAerisData(data){
    // console.log(data.response[0]);
    let weightedVal = {value : parseInt(data.response[0].ob.sky), weight : 2};
    weightedData.ae = weightedVal;
  };

  function heuristicVals(){
    console.log(weightedData);

    let sunsetVal = 0;
    for (key in weightedData) {
      if (key != "an") {
        sunsetVal += weightedData[key].value / weightedData[key].weight;
      };
    };
    let heuristicCloudCoverage = ((sunsetVal / (Object.keys(weightedData).length)) - 1).toFixed(2);
    let heuristicAirQuality = (weightedData.an.value).toFixed(2);
    // console.log(sunsetTime.time.time);

    calculateSunset(heuristicCloudCoverage, heuristicAirQuality);
  };

  function calculateSunset(cloud, air) {
    let displayResults = document.querySelector("#results");

    let chance = ((parseFloat(cloud) + parseFloat(air)) / 2).toFixed(2);
    console.log("Chance - " + chance);

    if (chance < 20) {
      displayResults.innerHTML = "Minimal Chance - " + chance;
    } else if (chance < 40) {
      displayResults.innerHTML = "Poor Chance - " + chance;
    } else if (chance < 60) {
      displayResults.innerHTML = "Good Chance - " + chance;
    } else if (chance < 80) {
      displayResults.innerHTML = "Great Chance - " + chance;
    } else if (chance < 100) {
      displayResults.innerHTML = "Too many Clouds - " + chance;
    }

  };

});
