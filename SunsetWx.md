#How to register, login, and get with the Command Line

## Register
 - curl -X "POST" -d "email=PUTEMAILHERE@EMAIL.com" -d "password=PUTPASSWORDHERE" -d "key=YOURAPIKEY" "https://sunburst.sunsetwx.com/v1/register"

## Login
 - curl -X "POST" "https://sunburst.sunsetwx.com/v1/login" -d "email=PUTEMAILHERE@EMAIL.com" -d "password=PUTPASSWORDHERE"
 - This will give you your Bearer Authorization token. This token lasts 6 hours.

## Request
 - curl -X "GET" "https://sunburst.sunsetwx.com/v1/quality?type=sunset&coords=-77.8600012%2C40.7933949" \  -H "Authorization: Bearer eyJhbGciOiJSUz..."

#How to use in Express

## Register
  - register with curl. It's a one off thing
  - curl -X "POST" -d "email=PUTEMAILHERE@EMAIL.com" -d "password=PUTPASSWORDHERE" -d "key=YOURAPIKEY" "https://sunburst.sunsetwx.com/v1/register"

## Login
 - This is a low volume app (i.e. almost no one is going to use this regularly) so I structure my routes as such (sunsetwxLogin, getSunsetWXData). Each time I hit the API I get a token, the sunsetwx API is setup to only give you a new one every 6 hours.
 ```
 function sunsetwxLogin(req,res,next) {
   let loginInfo = {
     email: API_EMAIL.toLowerCase(),
     password: API_PASSWORD
   };

   fetch('https://sunburst.sunsetwx.com/v1/login', {
     headers: {
       'Content-Type':'application/x-www-form-urlencoded; charset=utf-8'
     },
     method: 'POST',
     body: urlencoded(loginInfo)
   })
     .then(r => r.json())
     .then(token => {
       res.sunsetwx_authorization = token.token
       next();
     })
     .catch(err => next(err))
 };

 function getSunsetWXData(req,res,next) {
   const header = {
     "Authorization" : "Bearer " + res.sunsetwx_authorization
   };
   //These guys do longitude first latitude second
   //longitude: -77.8600012 latitude: 40.7933949

   fetch(`${API_URL}&coords=${req.body.longitude}%2C${req.body.latitude}`, {
     headers: header
   })
     .then(r => r.json())
     .then((result) => {
       res.sunsetWxData = result;
       next();
     })
     .catch((err) => {
       next(err);
     });
 };
 ```
 - 
