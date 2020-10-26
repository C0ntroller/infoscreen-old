const DataContainer = require("./DataContainer.js");
const XMLParser =  require('fast-xml-parser');
const CommonUtils = require("./CommonUtils.js");

class NewsContainer extends DataContainer {
    constructor() {
        super("news");
    }

    updateContainer(updateData) {
        updateData = XMLParser.parse(updateData);

        let table = document.createElement("table");

        updateData["feed"]["entry"].forEach(entry => {
            let row = document.createElement("tr");
            row.appendChild(document.createElement("td")).innerHTML = entry.title;
            let date = new Date(entry.updated);
            table.appendChild(row).appendChild(document.createElement("td")).innerHTML = CommonUtils.pad(date.getHours()) + ":" + CommonUtils.pad(date.getMinutes());
        });

        document.getElementById("newsContainerInner").innerHTML = table.outerHTML + table.outerHTML;
    }
}

module.exports = NewsContainer;