const DataContainerToken = require("./DataContainerToken.js");
const CommonUtils = require("./CommonUtils.js");

class CalendarContainer extends DataContainerToken {
    constructor() {
        super("calendar", 0);
    }

    updateContainer(updateData) {
        //console.log(updateData);
        let table = document.createElement("table");
        let lastDate = new Date(0);
        lastDate = String(lastDate.getFullYear()) + lastDate.getMonth() + lastDate.getDate();

        updateData["items"].forEach(entry => {
            let entryDate;
            if(entry.start.date) {
                entryDate = new Date(entry.start.date);
            } else if(entry.start.dateTime) {
                entryDate = new Date(entry.start.dateTime);
            }
            let entryDateString = String(entryDate.getFullYear()) + entryDate.getMonth() + entryDate.getDate();

            if(entryDateString != lastDate) {
                lastDate = entryDateString;
                let dateHeader = document.createElement("td");
                dateHeader.colSpan = "2";
                dateHeader.classList.add("calendarDateHeader");
                dateHeader.innerHTML = CommonUtils.dowToString(entryDate.getDay()) + ", " + entryDate.getDate() + ". " + (entryDate.getMonth() + 1) + ".";
                table.appendChild(document.createElement("tr")).appendChild(dateHeader);
            }

            if(entry.start.date) {
                let entryTd = document.createElement("td");
                entryTd.colSpan = "2";
                let entryRow = document.createElement("tr");
                entryRow.classList.add("calendarEntry");
                table.appendChild(entryRow).appendChild(entryTd).innerHTML = entry.summary;
            } else if(entry.start.dateTime) {
                var entryRow = document.createElement("tr");
                entryRow.classList.add("calendarEntry");
                entryRow.appendChild(document.createElement("td")).innerHTML = entry.summary;
                table.appendChild(entryRow).appendChild(document.createElement("td")).innerHTML = CommonUtils.pad(entryDate.getHours()) + ":" + CommonUtils.pad(entryDate.getMinutes());
            }

            });


        document.getElementById("calendarContainer").innerHTML = table.outerHTML;
    }
}

module.exports = CalendarContainer;