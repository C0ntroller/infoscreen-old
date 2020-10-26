const DataContainer = require("./DataContainer.js");
const RequestManager = require("./RequestManager.js");

class DataContainerToken extends DataContainer {
    constructor(secretsKey, secretsIndex = 0) {
        super(secretsKey, secretsIndex);
        this.state = 0; //0 = disconnected; 1 = refreshing; 2 = connected
        this.access_token = null;
        this.next_refresh = new Date(0);
    }

    get hasValidAccess() {
        return ((new Date()) < this.next_refresh);
    }

    refreshAccessToken() {
        this.state = 1;
        RequestManager.requestData(this.secretsKey + "Token", this.secretsIndex, function(response){
            //console.log(response);
            this.access_token = response["access_token"];            
            var dateNow = new Date();
            dateNow.setHours(dateNow.getHours() + 1);
            dateNow.setMinutes(dateNow.getMinutes() - 2); // just to be safe
            this.next_refresh = dateNow;
            this.state = 2;

            this.requestData();
        }.bind(this));
    }

    requestData() {
        if(this.state == 1){      
            setTimeout(function(){ this.requestData() }.bind(this), 1000);
            return;
        }
        if(!this.hasValidAccess) {
            this.refreshAccessToken();
            return;
        }
        super.requestData(this.access_token);
    }
}

module.exports = DataContainerToken;