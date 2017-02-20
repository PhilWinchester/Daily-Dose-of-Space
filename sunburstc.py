#!/usr/bin/env python3.5

###############################################################
### Sunburst API example client -- sunburst.sunsetwx.com/v1 ###
###############################################################

# Copyright (C) 2016 Sunset Wx, LLC. -- All rights reserved.
# Unauthorized copying, reproduction, or redistribution of this file, in whole
# or in part, via any medium, is strictly prohibited.

# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
# AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
# IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
# FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
# DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
# CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICTLIABILITY,
# OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

# We recommend using Python 3.5 or higher.


#####################
### User Settings ###
#####################

Email           = "philipwinc@gmail.com"
Password        = "Dtat25000"
RegistrationKey = "d4DpuHf7O3rwn6nSJuckzrRY"

import os
SettingsDirPath = os.path.expanduser('~')+"/.sunsetwx/sunburst" # This is where the session token will be stored on your system.
TokenCachePath  = SettingsDirPath+"/access.token"               # This is the name of the file where a login session token is stored.


#########################
### Internal Settings ###
#########################

import platform
UserAgentString = "Sunburst API Example/0.0.3 ("+platform.platform()+")" # We like to know which types of systems use our service
APIDomain       = "sunburst.sunsetwx.com"
APIDirectory    = "/v1"

import re
DetectCoordinatesRegex = re.compile("^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$") # Used to detect if an input is a valid latitude and longitude string


################
### API URLs ###
################

RegisterURL      = APIDirectory+"/register"
LogInURL         = APIDirectory+"/login"
DeleteAccountURL = APIDirectory+"/account"
ResetPassURL     = APIDirectory+"/account/password/reset"
GetQualityURL    = APIDirectory+"/quality"
GetCoordsURL     = APIDirectory+"/coordinates"
GetLocationURL   = APIDirectory+"/location"


##########################
### External Libraries ###
##########################

#import os # Already imported
#import platform
#import re
import urllib.request, urllib.parse, urllib.error
import json
import socket
import time
import sys
import ssl


#########################
### Utility Functions ###
#########################

## Local

def readExistToken():
    try:
        with open(TokenCachePath, "r") as f:
            token = f.read()
            f.close()

            return token

    except IOError as e:
        sys.exit(e)

def checkTokenCache():

    if os.path.exists(TokenCachePath):
        tokenAge = time.time() - os.path.getmtime(TokenCachePath)

        if tokenAge > (5 * 60 * 60): # Handle possible client-server time difference by renewing token an hour early.

            if tokenAge < (6 * 60 * 60):
                logout() # Logout the previous token if it's still less than 6 hours old.

            res = login()

            if res["error"] == "":
                return res["token"] # Return the new token
            else:
                sys.exit(res["error"])

        else:
            return readExistToken() # If the file exists, return the existing token
    else:
        res = login()

        if res["error"] == "":
            return res["token"]
        else:
            sys.exit(res["error"])


def sortJSONResp(respJSON):

    respJSON["features"] = sorted(respJSON["features"], key=lambda feature: feature["properties"]["distance"])
    return respJSON


## Remote

def register():

    try:
        reqString = "https://"+APIDomain+RegisterURL
        params = urllib.parse.urlencode({
            "key": RegistrationKey,
            "email": Email,
            "password": Password
        }).encode('utf-8')

        req    = urllib.request.Request(reqString, params, headers={ "User-Agent": UserAgentString })
        responseJSON = json.loads(urllib.request.urlopen(req, context=Ctx).read().decode('utf8', 'ignore'))

        if os.path.exists(TokenCachePath):
            os.remove(TokenCachePath)

        return {
            "message": responseJSON["message"],
            "error": ""
        }

    except urllib.error.HTTPError as e:

        return {
            "error":e.read().decode('utf8', 'ignore')
        }


def login():

    try:
        reqString = "https://"+APIDomain+LogInURL
        params = urllib.parse.urlencode({
                "email": Email,
                "password": Password
        }).encode('utf-8')

        req          = urllib.request.Request(reqString, params, headers={ "User-Agent": UserAgentString })
        responseJSON = json.loads(urllib.request.urlopen(req, context=Ctx).read().decode('utf8', 'ignore'))

        if os.path.exists(TokenCachePath):
            os.remove(TokenCachePath)

        with open(TokenCachePath, "w") as f:
            f.write(responseJSON["token"])

        return {
            "token": responseJSON["token"],
            "token_exp_sec": responseJSON["token_exp_sec"],
            "error": ""
        }

    except urllib.error.HTTPError as e:

        return {
            "error": e.read().decode('utf8', 'ignore')
        }


def logout():

    if os.path.exists(TokenCachePath):
        os.remove(TokenCachePath)
        if os.path.exists(TokenCachePath) == False:
            return "Logged out"

    return "No active session could be found."


def resetPass():

    try:
        reqString    = "https://"+APIDomain+ResetPassURL
        params       = urllib.parse.urlencode({ "email": Email }).encode('utf-8')

        req          = urllib.request.Request(reqString, params, headers={ "User-Agent": UserAgentString })
        responseJSON = json.loads(urllib.request.urlopen(req, context=Ctx).read().decode('utf8', 'ignore'))

        return responseJSON["message"]

    except urllib.error.HTTPError as e:

        return e.read().decode('utf8', 'ignore')


def deleteAccount(token):

    try:
        reqString = "https://"+APIDomain+DeleteAccountURL
        req    = urllib.request.Request(reqString, None, headers={
            "Authorization": "Bearer "+token,
            "User-Agent": UserAgentString
        }, method='DELETE')
        responseJSON = json.loads(urllib.request.urlopen(req, context=Ctx).read().decode('utf8', 'ignore'))

        if os.path.exists(TokenCachePath):
            os.remove(TokenCachePath)

        return responseJSON["message"]

    except urllib.error.HTTPError as e:

        return e.read().decode('utf8', 'ignore')



##############################################
### Information Fetching/Parsing Functions ###
##############################################


def getCoords(queryLocation, token):

    try:
        if queryLocation[0:1] == " ":
            queryLocation = queryLocation[1:]

        reqString = "https://"+APIDomain+GetCoordsURL+"?location="+queryLocation.replace(" ", "%20")
        req    = urllib.request.Request(reqString, None, headers={
            "Authorization": "Bearer "+token,
            "User-Agent": UserAgentString
        })
        responseJSON = json.loads(urllib.request.urlopen(req, context=Ctx).read().decode('utf8', 'ignore'))

        return {
            "locale": responseJSON["properties"]["locale"],
            "country": responseJSON["properties"]["country"],
            "region": responseJSON["properties"]["region"],
            "latitude": responseJSON["geometry"]["coordinates"][1],
            "longitude": responseJSON["geometry"]["coordinates"][0],
            "source": responseJSON["properties"]["source"],
            "error": ""
        }

    except urllib.error.HTTPError as e:

        return {
            "error": e.read().decode('utf8', 'ignore')
        }


def getLocation(latitude, longitude, token):

    try:
        reqString = "https://"+APIDomain+GetLocationURL+"?coords="+longitude+","+latitude
        req    = urllib.request.Request(reqString, None, headers={
            "Authorization": "Bearer "+token,
            "User-Agent": UserAgentString
        })
        responseJSON = json.loads(urllib.request.urlopen(req, context=Ctx).read().decode('utf8', 'ignore'))

        return {
            "locale": responseJSON["properties"]["locale"],
            "country": responseJSON["properties"]["country"],
            "region": responseJSON["properties"]["region"],
            "latitude": responseJSON["geometry"]["coordinates"][1],
            "longitude": responseJSON["geometry"]["coordinates"][0],
            "source": responseJSON["properties"]["source"],
            "error": ""
        }

    except urllib.error.HTTPError as e:

        return {
            "error": e.read().decode('utf8', 'ignore')
        }


def locationGetQuality(modelType, queryLocation, token):

    try:
        coords = getCoords(queryLocation, token)
        if coords["error"] == "":

            if coords["country"] == "US" and coords["region"] != "HI" and coords["region"] != "AK": # Exclude HI and AK because they're not in the "northamerica" model
                location = coords["locale"]+", "+coords["region"]+", "+coords["country"]
            else:
                location = coords["locale"]+", "+coords["country"]

            reqString = "https://"+APIDomain+GetQualityURL+"?type="+modelType+"&coords="+str(coords["longitude"])+","+str(coords["latitude"])
            req    = urllib.request.Request(reqString, None, headers={
                "Authorization": "Bearer "+token,
                "User-Agent": UserAgentString
            })
            responseJSON = sortJSONResp(json.loads(urllib.request.urlopen(req, context=Ctx).read().decode('utf8', 'ignore')))

            return {
                "latitude":        responseJSON["features"][0]["geometry"]["coordinates"][1],
                "longitude":       responseJSON["features"][0]["geometry"]["coordinates"][0],
                "location":        location,
                "type":            responseJSON["features"][0]["properties"]["type"],
                "quality":         responseJSON["features"][0]["properties"]["quality"],
                "quality_percent": responseJSON["features"][0]["properties"]["quality_percent"],
                "quality_value":   responseJSON["features"][0]["properties"]["quality_value"],
                "rel_humidity":    responseJSON["features"][0]["properties"]["rel_humidity"],
                "high_clouds":     responseJSON["features"][0]["properties"]["high_clouds"],
                "vertical_vel":    responseJSON["features"][0]["properties"]["vertical_vel"],
                "pressure_tend":   responseJSON["features"][0]["properties"]["pressure_tend"],
                "last_updated":    responseJSON["features"][0]["properties"]["last_updated"],
                "imported_at":     responseJSON["features"][0]["properties"]["imported_at"],
                "valid_at":        responseJSON["features"][0]["properties"]["valid_at"],
                "source":          responseJSON["features"][0]["properties"]["source"],
                "distance":        responseJSON["features"][0]["properties"]["distance"],
                "error":           ""
            }

        else:
            return {
                "error": coords["error"]
            }

    except urllib.error.HTTPError as e:

        return {
            "error": e.read().decode('utf8', 'ignore')
        }


def coordinatesGetQuality(modelType, latitude, longitude, token):

    try:
        reqString = "https://"+APIDomain+GetQualityURL+"?type="+modelType+"&coords="+longitude+","+latitude
        req    = urllib.request.Request(reqString, None, headers={
            "Authorization": "Bearer "+token,
            "User-Agent": UserAgentString
        })
        responseJSON = sortJSONResp(json.loads(urllib.request.urlopen(req, context=Ctx).read().decode('utf8', 'ignore')))

        location = getLocation(str(responseJSON["features"][0]["geometry"]["coordinates"][1]), str(responseJSON["features"][0]["geometry"]["coordinates"][0]), token)

        if location["error"] == "":

            usRegion = ""
            if location["country"] == "US":
                usRegion = str(location["region"])+", "

            return {
                "latitude":        responseJSON["features"][0]["geometry"]["coordinates"][1],
                "longitude":       responseJSON["features"][0]["geometry"]["coordinates"][0],
                "location":        location["locale"]+", "+usRegion+location["country"],
                "type":            responseJSON["features"][0]["properties"]["type"],
                "quality":         responseJSON["features"][0]["properties"]["quality"],
                "quality_percent": responseJSON["features"][0]["properties"]["quality_percent"],
                "quality_value":   responseJSON["features"][0]["properties"]["quality_value"],
                "rel_humidity":    responseJSON["features"][0]["properties"]["rel_humidity"],
                "high_clouds":     responseJSON["features"][0]["properties"]["high_clouds"],
                "vertical_vel":    responseJSON["features"][0]["properties"]["vertical_vel"],
                "pressure_tend":   responseJSON["features"][0]["properties"]["pressure_tend"],
                "last_updated":    responseJSON["features"][0]["properties"]["last_updated"],
                "imported_at":     responseJSON["features"][0]["properties"]["imported_at"],
                "valid_at":        responseJSON["features"][0]["properties"]["valid_at"],
                "source":          responseJSON["features"][0]["properties"]["source"],
                "distance":        responseJSON["features"][0]["properties"]["distance"],
                "error":           ""
            }

        else:
            return {
                "error": location["error"]
            }

    except urllib.error.HTTPError as e:

        return {
            "error": e.read().decode('utf8', 'ignore')
        }


def getQuality(token):

    if len(sys.argv) >= 5: # Latitude and Longitude query

        modelType = sys.argv[2]
        latitude = sys.argv[3]
        longitude = sys.argv[4]

        if DetectCoordinatesRegex.match(latitude+","+longitude):

            return coordinatesGetQuality(modelType, latitude, longitude, token)

        else: # Location-based query

            queryLocation = ""
            for locationPiece in sys.argv[3:]:
                queryLocation += " "+locationPiece

            return locationGetQuality(modelType, queryLocation, token)

    elif len(sys.argv) <= 3:
        printUsage() # Fix for invalid number of arguments

    else: # Location-based query

        modelType = sys.argv[2]
        queryLocation = ""

        if len(sys.argv) == 4:
            queryLocation = sys.argv[3]
        else:
            for locationPiece in sys.argv[3:]:
                queryLocation += " "+locationPiece

        return locationGetQuality(modelType, queryLocation, token)



##################################
### Print to Console Functions ###
##################################


def printRegistrationResponse(resp):
    if resp != None:
        if resp["error"] == "":
            print(resp["message"])
        else:
            print(resp["error"])


def printCoords(resp):
    if resp != None:
        if resp["error"] == "":

            usRegion = ""
            if resp["country"] == "US":
                usRegion = str(resp["region"])+", "

            location = "N/A"
            if resp["country"] != "":
                location = str(resp["country"])
                if resp["locale"] != "":
                    location = str(resp["locale"])+", "+usRegion+str(resp["country"])

            print("")
            print("Coordinates:             "+str(resp["latitude"])+", "+str(resp["longitude"]))
            print("Location:                "+location)
            print("Source:                  "+resp["source"])
            print("")
        else:
            print(resp["error"])


def printLocation(resp):
    if resp != None:
        if resp["error"] == "":

            usRegion = ""
            if resp["country"] == "US":
                usRegion = resp["region"]+", "

            location = "N/A"
            if resp["country"] != "":
                location = resp["country"]
                if resp["locale"] != "":
                    location = resp["locale"]+", "+usRegion+resp["country"]

            print("")
            print("Coordinates:             "+str(resp["latitude"])+", "+str(resp["longitude"]))
            print("Location:                "+location)
            print("Source:                  "+resp["source"])
            print("")
        else:
            print(resp["error"])


def printQuality(resp):
    if resp != None:
        if resp["error"] == "":

            location = "N/A"
            if resp["location"] != ", ":
                location = resp["location"]

            importedAt = "0000-00-00T00:00:00Z"
            if resp["imported_at"] != "":
                importedAt = resp["imported_at"]

            print("")
            print("Coordinates:             "+str(resp["latitude"])+", "+str(resp["longitude"]))
            print("Location:                "+location)
            print("Distance:                "+str(resp["distance"])+" km")
            print("Type:                    "+resp["type"])
            print("Quality:                 "+resp["quality"])
            print("Quality Percentage:      "+str(resp["quality_percent"])+"%")
            print("Quality Value:           "+str(resp["quality_value"]))
            print("Relative Humidity:       "+str(resp["rel_humidity"]))
            print("High Clouds:             "+str(resp["high_clouds"]))
            print("Vertical Velocity:       "+str(resp["vertical_vel"])+" ub/sec")
            print("Pressure Tendency:       "+str(resp["pressure_tend"])+" mb/hr")
            print("Last Updated:            "+resp["last_updated"])
            print("Imported at:             "+importedAt)
            print("Valid at:                "+resp["valid_at"])
            print("Source:                  "+resp["source"])
            print("")
        else:
            print(resp["error"])


def printUsage():
    print("Usage: ./sunburstc.py [OPTION]")
    print("")
    print("Options:")
    print("  --register             Register with the Sunburst API.")
    print("  --logout               Logout of the Sunburst API.")
    print("  --reset-password       Send a password reset email to your email address.")
    print("  --delete-account       Permanently remove your account.")
    print("")
    print("  -q, --get-quality      [sunrise/sunset] [latitude] [longitude] (recommended)")
    print("                         or")
    print("                         [sunrise/sunset] [locale]")
    print("                         Get the sunrise or sunset quality for a location.")
    print("")
    print("  -c, --get-coordinates  [locale]")
    print("                         Search for coordinates using a locale name.")
    print("")
    print("  -l, --get-location     [latitude] [longitude]")
    print("                         Search for a location name, region, and country.")
    print("")


#################
### Setup TLS ###
#################

Ctx = ssl.create_default_context()
Ctx.verify_mode = ssl.CERT_REQUIRED


#################################
### Create Settings Directory ###
#################################

if os.path.exists(SettingsDirPath) == False:
    os.makedirs(SettingsDirPath, exist_ok=False)


#################################
### Parse Shell Argument/Flag ###
#################################


try:
    if len(sys.argv) > 1:

        if sys.argv[1] == "--register":
            printRegistrationResponse(register())

        elif sys.argv[1] == "--logout":
            print(logout())

        elif sys.argv[1] == "--reset-password":
            print(resetPass())

        elif sys.argv[1] == "--delete-account":
            token = checkTokenCache()
            print(deleteAccount(token))

        elif sys.argv[1] == "-q" or sys.argv[1] == "--get-quality":
            token = checkTokenCache()
            printQuality(getQuality(token))

        elif sys.argv[1] == "-c" or sys.argv[1] == "--get-coordinates":
            token = checkTokenCache()

            if len(sys.argv) > 2:

                queryLocation = ""
                if len(sys.argv) == 3:
                    queryLocation = sys.argv[2]
                else:
                    for locationPiece in sys.argv[2:]:
                        queryLocation += " "+locationPiece

                printCoords(getCoords(queryLocation, token))
            else:
                printUsage()

        elif sys.argv[1] == "-l" or sys.argv[1] == "--get-location":
            token = checkTokenCache()
            printLocation(getLocation(sys.argv[2], sys.argv[3], token))

        else:
            printUsage()
    else:
        printUsage()

except IndexError:
    print("")
    print("Input error: invalid number of arguments")
    print("")
    print("Ensure that you are using the format: ./sunburstc.py --argument option, and that you have an appropriate number of arguments for the option that you have chosen.")
    print("")

except UnicodeEncodeError:
    print("Encoding Error")
    responseFail = True
