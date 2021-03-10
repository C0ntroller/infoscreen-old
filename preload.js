// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const CalendarContainer = require("./src/js/CalendarContainer.js");
const DvbContainer = require("./src/js/DvbContainer.js");
const NewsContainer = require("./src/js/NewsContainer.js");
const QuoteContainer = require("./src/js/QuoteContainer.js");
//const SpotifyContainer = require("./src/js/SpotifyContainer.js");
const VolumIOContainer = require("./src/js/VolumIOContainer.js");
const WeatherContainer = require("./src/js/WeatherContainer.js");
const TimeAndBg = require("./src/js/TimeAndBg.js");

window.addEventListener('DOMContentLoaded', () => {
  var containerStash = {
    interval_30s: {
        items: [],
        timeInSec: 30*1000
    },
    interval_15min: {
        items: [],
        timeInSec: 15*60*1000
    },
    interval_24h: {
        items: [],
        timeInSec: 24*60*60*1000
    }
  }
  containerStash.interval_30s.items.push(new DvbContainer(0));
  containerStash.interval_30s.items.push(new DvbContainer(1));
  //containerStash.interval_30s.items.push(new SpotifyContainer(0));
  containerStash.interval_15min.items.push(new CalendarContainer());
  containerStash.interval_15min.items.push(new NewsContainer());
  containerStash.interval_15min.items.push(new WeatherContainer());
  containerStash.interval_24h.items.push(new QuoteContainer());
  var volumio = new VolumIOContainer(0);
  var time = new TimeAndBg(3);

  for(var interval in containerStash) {
  containerStash[interval].items.forEach(element => {
      element.requestData();
      setInterval(
          function(){
              element.requestData()
          }.bind(element), 
          containerStash[interval].timeInSec);
    });
  }
});