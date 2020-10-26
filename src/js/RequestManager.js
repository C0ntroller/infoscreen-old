const request = require("request");
const secrets = require("./Secrets.js");

class RequestManager {
    static requestData(secretsKey, secretsIndex, callback, extraInfo="") {
        //import secrets from Secrets
        let config;

        switch (secretsKey) {
            case "dvb":
                let time = new Date();
                time.setMinutes(time.getMinutes() + 3);
                config = {
                    url: "https://webapi.vvo-online.de/dm",
                    method: "POST",
                    formData: {
                        stopid: secrets.dvb[secretsIndex].stop_id,
                        limit: 5,
                        time: time.toUTCString()
                    }
                };
                break;
            case "weather":
                config = {
                    url: "https://api.darksky.net/forecast/" + secrets.weather[secretsIndex].api_key + "/" + secrets.weather[secretsIndex].coords + "?exclude=minutely,hourly&lang=de&units=ca",
                    method: "GET"
                };
                break;
            case "spotifyToken":
                config = {
                    url: "https://accounts.spotify.com/api/token",
                    method: "POST",
                    form: {
                        grant_type: "refresh_token",
                        refresh_token: secrets.spotify[secretsIndex].refresh_token,
                        client_id: secrets.spotify[secretsIndex].client_id,
                        client_secret: secrets.spotify[secretsIndex].client_secret
                    }
                };
                break;
            case "spotify":
                config = {
                    url: "https://api.spotify.com/v1/me/player",
                    method: "GET",
                    auth: {"bearer": extraInfo}
                }
                break;
            case "news":
                config = {
                    url: "https://www.tagesschau.de/xml/atom/",
                    method: "GET"
                };
                break;
            case "calendarToken":
                config = {
                    url: "https://accounts.google.com/o/oauth2/token",
                    method: "POST",
                    form: {
                        grant_type: "refresh_token",
                        refresh_token: secrets.calendar[secretsIndex].refresh_token,
                        client_id: secrets.calendar[secretsIndex].client_id,
                        client_secret: secrets.calendar[secretsIndex].client_secret
                    }
                };
                break;
            case "calendar":
                let timeMin = new Date();
                timeMin.setHours(timeMin.getHours()-1);
                let params = new URLSearchParams({
                    "alwaysIncludeEmail": "true",
                    "orderBy": "startTime",
                    "fields": "items(creator,start,summary)",
                    "singleEvents": "true",
                    "maxResults": 10,
                    "timeMin": timeMin.toISOString(),
                    //"prettyPrint": true,
                    "key": secrets.calendar[secretsIndex].api_key
                });
                config = {
                    url: "https://www.googleapis.com/calendar/v3/calendars/" + secrets.calendar[secretsIndex].calendar_id + "/events?" + params.toString(),
                    method: "GET",
                    auth: {'bearer': extraInfo}
                };
                break;
            case "quote":
                config = {
                    url: "https://c0ntroller.de/zitate.php?raw=true",
                    method: "GET"
                };
                break;
            case "svg":
            case "raw":
                config = {
                    url: extraInfo,
                    method: "GET"
                }
                break;
            default:
                return;
        }

        //console.log(config);

        request(config, (error, response, body) => {
            if(error) {
                console.error(error);
                return;
            }
            //statusUpdate(error);
            //console.log(response);
            //console.log(body)
            try {                
                body = JSON.parse(body);
            } 
            catch(err) {}            
            callback(body);
        });
    }
}

module.exports = RequestManager;