const DataContainer = require("./DataContainer.js");
const CommonUtils = require("./CommonUtils.js");

class WeatherContainer extends DataContainer {
    constructor() {
        super("weather");
    }

    updateContainer(updateData) {   
        this.updateSvgContext(document.getElementById("weatherIcon"), updateData.currently.icon);
        document.getElementById("temperature").innerHTML = (Math.round(updateData.currently.temperature * 10) / 10) + "°C";
        document.getElementById("currentWeatherInfos").innerHTML = updateData.currently.summary;

        //Forcast
        let root = document.getElementById("futureWeatherInfos");
        let headers = root.getElementsByClassName("futureWeatherHeader");
        let icons = root.getElementsByClassName("futureWeatherIcon");
        let highTemps = root.getElementsByClassName("futureWeatherHighTemp");
        let lowTemps = root.getElementsByClassName("futureWeatherLowTemp");

        for(let i=0; i<4; i++){
            let day = new Date((updateData.daily.data[i].time * 1000));
            headers[i].innerHTML = CommonUtils.dowToString(day.getDay()) + ", " + day.getDate() + ". " + (day.getMonth() + 1) + ".";

            this.updateSvgContext(icons[i], updateData.daily.data[i].icon);

            highTemps[i].innerHTML = (Math.round(updateData.daily.data[i].temperatureHigh * 10) / 10) + "°C";
            lowTemps[i].innerHTML = (Math.round(updateData.daily.data[i].temperatureLow * 10) / 10) + "°C";
        }

        //Radar
        document.getElementById("radar").src = "https://www.dwd.de/DWD/wetter/radar/radfilm_sac_akt.gif?r=" + Date.now();
        //document.getElementById("radar").src = "https://www.dwd.de/DWD/wetter/radar/rad_sac_akt.jpg?r=" + Date.now();
    }

    getSvgData(iconName, callback){
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if(request.readyState == 4 && request.status == 200) {
                let body = request.responseText;
                body = body.substring(body.indexOf("<svg "), body.indexOf("</svg>") + 6)
                callback(body);
            }
        }
        request.onerror = function() {
            console.error(request.status);
            console.error(request.response);
        }
        request.open('GET', "src/img/weather/"+ iconName + ".svg", true);
        request.send(null);
    }

    updateSvgContext(htmlContainer, iconName){
        this.getSvgData(iconName, (svgData) => {
            htmlContainer.innerHTML = svgData;
        });
    }
}

module.exports = WeatherContainer;