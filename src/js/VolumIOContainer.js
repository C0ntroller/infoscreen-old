const io = require('socket.io-client');
const secrets = require("./Secrets.js");
const CommonUtils = require("./CommonUtils.js");

class VolumIOContainer {
    constructor(secretsIndex) {
        this.url = secrets["volumio"][secretsIndex]["ws_address"];
        this.socket = io(this.url + ":" + secrets["volumio"][secretsIndex]["ws_port"], {
            reconnectionDelayMax: 5*60*1000,
            autoConnect: false //To initialize listeners first
        });
        this.htmlContext = document.getElementById("spotify" + secretsIndex);
        this.lock = false;
        this.queue = [];

        this.socket.on("connect", () => {
            console.log("VolumIO connected");
        });
        this.socket.on("disconnect", () => {
            console.warn("VolumIO disconnected!");
        });
        this.socket.on("pushState", (data) => {
            if(this.lock) {
                this.queue.push(data);
                return;
            }

            this.lock = true;
            this.updateContainer(data);
        });
        
        this.socket.connect();
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

        if(this.queue_check()) {
            data = this.get_last_queue_item();
        }

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
        if(this.queue_check()) {
            this.updateContainer(this.get_last_queue_item());
            return;
        }

        this.htmlContext.innerHTML = "<div></div><span style='font-size:200%'>Hier läuft gerade nichts...</span>";
        document.documentElement.style.setProperty("--spotifyColor", "transparent");

        if(this.queue_check()) {
            this.updateContainer(this.get_last_queue_item());
            return;
        }

        this.lock = false;
    }

    waitForRendered(infoElement) {
        function rendered() {
            this.htmlContext.appendChild(infoElement);
            
            if(this.queue_check()) {
                this.updateContainer(this.get_last_queue_item());
                return;
            }

            this.lock = false;
        }
        
        function startRender() {
            //Rendering start
            requestAnimationFrame(rendered.bind(this));
        }
        
        requestAnimationFrame(startRender.bind(this));
    }

    queue_check() {
        return this.queue.length > 0 ? true : false;
    }

    get_last_queue_item() {
        let new_data = this.queue.pop();
        this.queue = [];
        return new_data;
    }
}

module.exports = VolumIOContainer;