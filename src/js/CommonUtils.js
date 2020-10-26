class CommonUtils {
    static pad(value,character="0") {
        if(value < 10) {
            return character + value;
        } else {
            return value;
        }
    }
    
    static dowToString(day) {
        switch(day) {
            case 0: return "Sonntag";
            case 1: return "Montag";
            case 2: return "Dienstag";
            case 3: return "Mittwoch";
            case 4: return "Donnerstag";
            case 5: return "Freitag";
            case 6: return "Samstag";
            default: return;
        }
    }
    
    static monthToString(month) {
        switch(month) {
            case 0: return "Januar";
            case 1: return "Februar";
            case 2: return "März";
            case 3: return "April";
            case 4: return "Mail";
            case 5: return "Juni";
            case 6: return "Juli";
            case 7: return "August";
            case 8: return "September";
            case 9: return "Oktober";
            case 10: return "November";
            case 11: return "Dezember";
            default: return;
        }
    }

    static getMinuteDif(date1, date2) {
        return (date1>date2)?Math.floor((date1-date2)/60000):Math.floor((date2-date1)/60000);
    }

    static getTextToBgColor(r,g,b) {
        if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
            return "#000000";
        }
    
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    
    static getAverageRGB(imgEl) {
    
        var blockSize = 5,
            defaultRGB = {r:0,g:0,b:0},
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = {r:0,g:0,b:0},
            count = 0;
    
        if (!context) {
            return defaultRGB;
        }
    
        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
    
        context.drawImage(imgEl, 0, 0);
    
        try {
            data = context.getImageData(0, 0, width, height);
        } catch(e) {
            /* security error, img on diff domain */
            return defaultRGB;
        }
    
        length = data.data.length;
    
        while ( (i += blockSize * 4) < length ) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i+1];
            rgb.b += data.data[i+2];
        }
    
        // ~~ used to floor values
        rgb.r = ~~(rgb.r/count);
        rgb.g = ~~(rgb.g/count);
        rgb.b = ~~(rgb.b/count);
    
        return rgb;
    
    }
}

module.exports = CommonUtils;