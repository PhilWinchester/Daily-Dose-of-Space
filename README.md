#Instagram Hit Algorithm

A simple web app that will tell you whether you need to get your filters out or not.

Implementation:
Taking data from several weather api's, this app will average out the values and calculate the likelihood of a special sunset in your area. These are two simple inputs, but give a base layer of data to inform the user if there will be a special sunset or not. Getting the user location with HTML5 geolaction and their sunset time with http://sunrise-sunset.org/api, will filter the data and allow the user to determine if the results are accurate or not.

User Story:
A user will have a simple login page that will log them in, or register them. The main page is a simple icon display that will inform the user about their sunset likelihood. Finally the last page allows the user to select how the sunset actually is, and will give feedback on how accurate the algorithm is.

Inspiration:
This is a slimmed down implementation of https://sunsetwx.com/ and is scaled for mobile use and simple user interaction.

Difficulties:
NOAA data is rather complicated and I don't know how to query for the data I want and when I can get data back I don't know what it means.
 - http://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND&locationid=ZIP:28801&startdate=2016-10-25&enddate=2016-10-26 queries zipcode 28801 from yesterday till today. However, if I switch to zipcode 10025 then I get no results back. Is that because there is no data for that zip or because I broke it?
