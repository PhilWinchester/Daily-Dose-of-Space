#How to register, login, and get with the Command Line

## Register
 - curl -X "POST" -d "email=PUTEMAILHERE@EMAIL.com" -d "password=PUTPASSWORDHERE" -d "key=YOURAPIKEY" "https://sunburst.sunsetwx.com/v1/register"

## Login
 - curl -X "POST" "https://sunburst.sunsetwx.com/v1/login" -d "email=PUTEMAILHERE@EMAIL.com" -d "password=PUTPASSWORDHERE"
 - This will give you your Bearer Authorization token. This token lasts 6 hours.

## Request
 - curl -X "GET" "https://sunburst.sunsetwx.com/v1/quality?type=sunset&coords=-77.8600012%2C40.7933949" \  -H "Authorization: Bearer eyJhbGciOiJSUz..."
