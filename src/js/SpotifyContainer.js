const DataContainerToken = require("./DataContainerToken.js");
const CommonUtils = require("./CommonUtils.js");

class SpotifyContainer extends DataContainerToken {
    constructor(secretsIndex) {
        super("spotify", secretsIndex);
        this.htmlContext = document.getElementById("spotify" + secretsIndex);
    }

    updateContainer(updateData) {
        if(JSON.stringify(this.currentData) != JSON.stringify(updateData)) {                    
            this.currentData = updateData;
            this.updateHtmlContext();
        }
    }

    updateHtmlContext() {
        this.htmlContext.innerHTML = "";
    
        if(!(this.currentData && this.currentData.is_playing && this.currentData.device.name == "Spoti-Pi")){
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
        img.src = this.currentData.item.album.images[1].url;
        this.htmlContext.appendChild(img);        
        musicInfo.innerHTML = "<span style='font-size:200%;font-weight:bold;'>" + this.currentData.item.name + "</span><br/>";    
        (this.currentData.item.artists).forEach((artist, idx, arr) => {
            musicInfo.innerHTML += artist.name;
            if(idx < (arr.length-1)) {
                musicInfo.innerHTML += " | ";
            }
        });
        musicInfo.innerHTML += "<br/>" + this.currentData.item.album.name;        
        musicInfo.classList.add("spotifyInfo");        
        musicInfo.style.padding = "5px 15px";
    }

    resetHtmlContext() {
        this.htmlContext.innerHTML = "<div></div><span style='font-size:200%'>Hier läuft gerade nichts...</span>";
        document.documentElement.style.setProperty("--spotifyColor", "transparent");
        return;
    }

    waitForRendered(infoElement) {
        function rendered() {
            this.htmlContext.appendChild(infoElement);
        }
        
        function startRender() {
            //Rendering start
            requestAnimationFrame(rendered.bind(this));
        }
        
        requestAnimationFrame(startRender.bind(this));
    }
}

module.exports = SpotifyContainer;