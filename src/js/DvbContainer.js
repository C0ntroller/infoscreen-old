const DataContainer = require("./DataContainer.js");
const CommonUtils = require("./CommonUtils.js");

class DvbContainer extends DataContainer {
    constructor(secretsIndex) {
        super("dvb", secretsIndex);
    }

    updateContainer(updateData){
        let context = document.getElementById("dvbTable" + this.secretsIndex);
        context.innerHTML = "";

        let headerRow = document.createElement("tr");

        let headerNameCell = document.createElement("td");
        headerNameCell.colSpan = 2;
        headerNameCell.className = "dvbNameHeader";
        headerNameCell.innerHTML=updateData["Name"];
        headerRow.appendChild(headerNameCell);

        let headerTimeCell = document.createElement("td");
        headerTimeCell.className = "dvbDescHeader"
        headerTimeCell.innerHTML = "Abfahrt";
        headerRow.appendChild(headerTimeCell);

        headerTimeCell = document.createElement("td");
        headerTimeCell.className = "dvbDescHeader"
        headerTimeCell.innerHTML = "In";
        headerRow.appendChild(headerTimeCell);

        context.appendChild(headerRow).appendChild(document.createElement("td"));

        updateData["Departures"].forEach(departure => {
            let depRow = document.createElement("tr");
            depRow.appendChild(document.createElement("td")).innerHTML = departure["LineName"];   
            depRow.appendChild(document.createElement("td")).innerHTML = departure["Direction"];

            let depTimeCell = document.createElement("td");
            depTimeCell.style.textAlign = "right";
            let depMinCell = document.createElement("td");
            depMinCell.style.textAlign = "right";
            let depDelCell = document.createElement("td");

            if(String(departure["State"]) == "Cancelled") {
                depMinCell.innerHTML = "<span style='color:red;font-weight:bold;'>X</span>";
            } else {
                if(departure["RealTime"]){
                    let realDate = new Date(parseInt(String(departure["RealTime"]).replace(/\/Date\(/g,"").replace(/\-.*$/g,"")));
                    
                    depTimeCell.innerHTML = realDate.getHours() + ":" + CommonUtils.pad(realDate.getMinutes());
                    depMinCell.innerHTML = CommonUtils.getMinuteDif(realDate,Date.now());
                    
                    if(String(departure["State"]) == "Delayed") { 
                        let sheduledDate = new Date(parseInt(String(departure["ScheduledTime"]).replace(/\/Date\(/g,"").replace(/\-.*$/g,"")));
                        depDelCell.innerHTML = "<span style='color:red;font-size:small;'>+" + CommonUtils.getMinuteDif(realDate,sheduledDate) + "</span>";
                    }
                } else {
                    let scheduledDate = new Date(parseInt(String(departure["ScheduledTime"]).replace(/\/Date\(/g,"").replace(/\-.*$/g,"")));

                    depTimeCell.innerHTML = scheduledDate.getHours() + ":" + CommonUtils.pad(scheduledDate.getMinutes());
                    depMinCell.innerHTML = CommonUtils.getMinuteDif(scheduledDate,Date.now());
                }
            }
            
            depRow.appendChild(depTimeCell);
            depRow.appendChild(depMinCell);
            depRow.appendChild(depDelCell);
            context.appendChild(depRow);
        });
    }
}

module.exports = DvbContainer;