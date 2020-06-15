class ColorUpdater {
    
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater;
        
        this.isDarkMode = false;
        this.isColorBlindnessMode = false; //used? boh

        this.darkmode_buttom = document.getElementById("darkmode_button");
        this.blind_buttom = document.getElementById("blind_button");
        
        var referenceColorUpdater = this;

        this.darkmode_buttom.addEventListener('click', function() {
            if(referenceColorUpdater.isDarkMode)
                referenceColorUpdater.isDarkMode = false;
            else
                referenceColorUpdater.isDarkMode = true;

            referenceColorUpdater.dataUpdater.darkmodeUpdateColor();
        });

        this.blind_buttom.addEventListener('click', function() {
            if(referenceColorUpdater.isColorBlindnessMode)
                referenceColorUpdater.isColorBlindnessMode = false;
            else
                referenceColorUpdater.isColorBlindnessMode = true;
            
            referenceColorUpdater.dataUpdater.blindmodeUpdateColor();
        });

    }

    getScatterplotPointsColors() {
        if(this.isDarkMode && !this.isColorBlindnessMode)
            return 'red';
        else if(!this.isDarkMode && this.isColorBlindnessMode)
            return 'black';
        else if(this.isDarkMode && this.isColorBlindnessMode)
            return 'yellow';
        else
            return "#2b77df";
    }

}
