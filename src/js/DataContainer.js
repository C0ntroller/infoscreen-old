const RequestManager = require("./RequestManager.js");

class DataContainer {

    constructor(secretsKey, secretsIndex = 0) {
        if (new.target === DataContainer) {
          throw new TypeError("Cannot construct Abstract instances directly");
        }
        this.currentData = null;
        this.secretsKey = secretsKey;
        this.secretsIndex = secretsIndex;
    }

    requestData(extraInfo="") {
        RequestManager.requestData(this.secretsKey, this.secretsIndex, function(response){this.updateContainer(response)}.bind(this), extraInfo);
    }

    updateContainer(updateData) {
        throw new Error('You have to implement the method doSomething!');
    }
}

module.exports = DataContainer;