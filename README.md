#Instagram Hit Algorithm
##aka Sunset Watcher

A simple web app that will tell you whether your current location should expect an extra special sunset or not.

##User Story
 - A user will be able to create an account that will be tied to their initial location.
 - Look up the current expectation for the sunset at their location
 - Store that entry, tied to their userId, to a collection that can be viewed whenever

##Use Case
The user will first be prompted with creating a new account or logging into an existing one. Next they will be taken to their profile page, which will have all previous lookups they have done. From their they can remove old entries or look up current sunset expectations. At the results page the user can look up each data set to see what fed into the result.

##Approach
1. Set up MVC
2. Set up simple server with data routes
3. Research and setup API's
4. Setup each API fetch
5. Make data routes to display json response
6. Set up weatherAlgorithm to parse data
7. Render a specific response to data results page
8. Front end refining
9. CSS Styling

##Implementation
Using 7 weather API's the application averages out several different values to create a simple heuristic value for cloud coverage and air quality. These two values are calculated from weighted inputs from each API and then averaged to create the percent chance of a sunset.
- At this stage the sunset is simply calculated from cloud coverage percentage and air quality index

##Soon to be released features
 1. Use SunsetWx data as validation
 2. Dates tied to entries
 3. Show user how long till next expected sunset
 5. Allow user to edit their default location
  1. Enter different Longitude and Latitude.
  2. Use Google Maps API to have user click on location.
  3. Have user search by city, town, or county.
 5. Have each data set be a customized page so user can inspect various weather API's
  1. Have input value from each API displayed on results page
 6. Average Sunset over time at location
 7. Add Key to explain icons/value importance

##Technologies Used
 1. Express
 2. Javascripts, HTML, CSS
 3. API's
    1. Aeris
    2. Air Now
    3. Dark Sky
    4. Forecast Gov
    5. Open Weather
    6. Sunset Time
    7. Sunset Wx
    8. Weather Underground

##Assistance from
1. GA instructions @gittheking @jasonseminara @trevorpreston @rapala61 @irwintsay for helping troubleshoot
 1. User authentication was supplied and demo'd to us from instructors. Minor editing was done to tailor the user authentication for this application, but the groundwork came from the instructors.
2. Sunset Wx Team for allowing me access to their API and being the inspiration for this project.

#Inspiration:
This is a slimmed down implementation of https://sunsetwx.com/ and is scaled for mobile use and simple user interaction.
