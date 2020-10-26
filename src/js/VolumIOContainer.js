const io = require('socket.io-client');
const secrets = require("./Secrets.js");
const CommonUtils = require("./CommonUtils.js");

class VolumIOContainer {
    constructor(secretsIndex) {
        this.url = secrets["volumio"][secretsIndex]["ws_address"];
        this.socket = io.connect(this.url + ":" + secrets["volumio"][secretsIndex]["ws_port"]);
        this.htmlContext = document.getElementById("spotify" + secretsIndex);
        this.lock = false;

        this.retryIntervall = setInterval(this.socket.connect, 5*60*1000);

        this.socket.on("connect", () => {
            clearInterval(this.retryIntervall);
            //console.log("Client connected");
        });
        this.socket.on("disconnect", () => {
            this.retryIntervall = setInterval(this.socket.connect, 5*60*1000);
            socket.connect();
        });
        this.socket.on("pushState", (data) => {
            if(this.lock) return;

            this.lock = true;
            this.updateContainer(data);
        });

        this.socket.emit("getState");
    }

    updateContainer(data) {
        this.htmlContext.innerHTML = "";
        
        if(data["status"] == "stop" || data["status"] == "pause" || data["mute"]) {
            this.resetHtmlContext();
            return;
        }

        var musicInfo = document.createElement("div");
            
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.style.height = "100%";  
        img.addEventListener('load', function() {
            this.waitForRendered(musicInfo);
            var pixelData = CommonUtils.getAverageRGB(img);
            musicInfo.style.color = CommonUtils.getTextToBgColor(pixelData.r,pixelData.g,pixelData.b);
            document.documentElement.style.setProperty("--spotifyColor", "rgba(" + pixelData.r + "," + pixelData.g + "," + pixelData.b + ", 0.8)");
        }.bind(this), false);
        img.src = data["albumart"].substring(0,1) == "/" ? this.url + data["albumart"] : data["albumart"];
        this.htmlContext.appendChild(img);
        
        if(data["trackType"] == "webradio" || data["service"] == "webradio") {
            if(data["uri"].includes(data["title"])) {
                data["title"] = "Werbung";
                data["album"] = data["artist"];
            } else {
                let meta = data["title"].split(" - ");
                if(meta.length < 2) {
                    data["album"] = data["artist"];
                } else {
                    data["album"] = data["artist"];
                    data["artist"] = meta.shift();
                    data["title"] = meta.join(" - ");
                }
            }
        }
        musicInfo.innerHTML = "<p><span class='spotify_title'>" + data["title"] + "</span><br/>" + data["artist"] + "<br/>" + data["album"] + "</p>";     
        musicInfo.classList.add("spotifyInfo");        
        musicInfo.style.padding = "5px 15px";
    }

    resetHtmlContext() {
        this.htmlContext.innerHTML = "<div></div><span style='font-size:200%'>Hier läuft gerade nichts...</span>";
        document.documentElement.style.setProperty("--spotifyColor", "transparent");
        this.lock = false;
    }

    waitForRendered(infoElement) {
        function rendered() {
            this.htmlContext.appendChild(infoElement);
            this.lock = false;
        }
        
        function startRender() {
            //Rendering start
            requestAnimationFrame(rendered.bind(this));
        }
        
        requestAnimationFrame(startRender.bind(this));
    }
}

module.exports = VolumIOContainer;