const CommonUtils = require("./CommonUtils.js");

class TimeAndBg {
    constructor(currentBg,numOfBgs,nightBg = false) {
        this.currentBg = currentBg;
        this.numOfBgs = numOfBgs;
        this.nightBg = nightBg ? nightBg : currentBg;
        this.hourNow = -1;   
        this.nightMode = false;
        this.timeTO = setInterval(this.updateTime.bind(this), 500);
        this.bgTO = setInterval(this.updateBg.bind(this), 30*60*1000);
    }

    updateTime() {
        let time = new Date();
        if(this.hourNow != time.getHours()) {
            this.hourNow = time.getHours();
            this.checkNightMode(this.hourNow);
        };
        document.getElementById("clock").innerHTML = this.hourNow + ":" + CommonUtils.pad(time.getMinutes());
        document.getElementById("date").innerHTML = CommonUtils.dowToString(time.getDay()) + ", der " + time.getDate() + ". " + CommonUtils.monthToString(time.getMonth()) + " " + time.getFullYear();
    }

    updateBg() {
        if(this.nightMode) {return;} //safety

        let newRand = Math.floor(Math.random() * this.numOfBgs);
        if(this.currentBg == newRand){
            newRand = (newRand + 1)%this.numOfBgs;
        }
        
        this.setNewBg(newRand)
    }

    checkNightMode(hour){
        if(hour < 7 && !this.nightMode) { //0-6
            this.applyNightmode();
            return true;
        } else if (hour >= 7 && this.nightMode) {
            this.removeNightmode();
            return false;
        } else {
            return this.nightMode;
        }
    }

    applyNightmode(){
        this.nightMode = true;
        clearInterval(this.bgTO);
        document.documentElement.style.setProperty('--containerBg', 'rgba(20,20,20,0.8)');
        document.documentElement.style.setProperty('--textColor','#b0b0b0');
        document.documentElement.style.setProperty('--iconColor','#b0b0b0');
        document.getElementById('radar').style.display = 'none';
        document.getElementById('radar-night').style.display = 'block';
        this.setNewBg(this.nightBg);
    }

    removeNightmode(){
        this.nightMode = false;
        this.bgTO = setInterval(this.updateBg.bind(this), 30*60*1000);
        document.documentElement.style.setProperty('--containerBg', 'rgba(255,255,255,0.5)');
        document.documentElement.style.setProperty('--textColor','#000000');
        document.documentElement.style.setProperty('--iconColor','#000000');
        document.getElementById('radar').style.display = 'block';
        document.getElementById('radar-night').style.display = 'none';
        this.updateBg();
    }

    setNewBg(newBgId) {
        let img = new Image()
        img.addEventListener('load', function() {
            function waitForRendered() {
                function rendered() {
                    document.body.style.backgroundImage = "url('src/img/bg/" + newBgId + ".jpg')";
                }                
                function startRender() {
                    requestAnimationFrame(rendered.bind(newBgId));
                }
                requestAnimationFrame(startRender.bind(newBgId));
            }
            waitForRendered()
        }.bind(newBgId), false);
        img.src = "src/img/bg/" + newBgId + ".jpg";

        this.currentBg = newBgId;
    }
}

module.exports = TimeAndBg;