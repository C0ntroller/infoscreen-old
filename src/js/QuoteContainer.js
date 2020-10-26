const DataContainer = require("./DataContainer.js");

class QuoteContainer extends DataContainer {
    constructor() {
        super("quote");
    }

    updateContainer(updateData) {
        //console.log(updateData);
        //updateData = JSON.parse(updateData);
        document.getElementById("quoteContainer").textContent = updateData[Math.floor(Math.random() * updateData.length)];
    }
}

module.exports = QuoteContainer;