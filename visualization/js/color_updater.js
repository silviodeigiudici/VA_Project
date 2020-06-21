class ColorUpdater {
    
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater;
        
        this.isDarkMode = false;
        //this.isColorBlindnessMode = false; //used? boh

        this.darkmode_buttom = document.getElementById("darkmode_button");
        //this.blind_buttom = document.getElementById("blind_button");
        
        var referenceColorUpdater = this;

        this.darkmode_buttom.addEventListener('click', function() {
            if(referenceColorUpdater.isDarkMode)
                referenceColorUpdater.isDarkMode = false;
            else
                referenceColorUpdater.isDarkMode = true;

            referenceColorUpdater.dataUpdater.darkmodeUpdateColor();

            referenceColorUpdater.switchMode();
        });
/*
        this.blind_buttom.addEventListener('click', function() {
            if(referenceColorUpdater.isColorBlindnessMode)
                referenceColorUpdater.isColorBlindnessMode = false;
            else
                referenceColorUpdater.isColorBlindnessMode = true;
            
            referenceColorUpdater.dataUpdater.blindmodeUpdateColor();
        });
*/
    }

    getModeColor() {
        if (this.isDarkMode) return "#1d1e21";
        else return "#FFFFFF";
    }

    getHeaderBackgroundColor() {
        if (this.isDarkMode) return "#383838";
        else return "#f3f3f3";
    }

    getTextColor() {
        if (this.isDarkMode) return "#FFFFFF";
        else return "#000000";
    }

    getBorderColor() {
        if (this.isDarkMode) return "#707070";
        else return "#808080";
    }

    getAxesColor() {
        if (this.isDarkMode) return "#FFFFFF";
        else return "#000000";
    }

    switchMode(){
        
        var duration = 100;
        d3.select("body").transition().duration(duration).style("background-color", this.getModeColor());
        d3.select(".header").transition().duration(duration).style("background-color", this.getHeaderBackgroundColor());
        d3.selectAll("p").transition().duration(duration).style("color", this.getTextColor());
        d3.selectAll("b").transition().duration(duration).style("color", this.getTextColor());
        d3.select(".header").style("border-bottom", "1px solid " + this.getBorderColor());
        d3.select(".histo_content").style("border", "2px solid " + this.getBorderColor());
        d3.select(".histo_version").style("border", "2px solid " + this.getBorderColor());
        d3.select(".barchart").style("border", "2px solid " + this.getBorderColor());
        d3.select(".parallel_plot").style("border", "2px solid " + this.getBorderColor());
        d3.select(".box_area").style("border", "2px solid " + this.getBorderColor());
        d3.select(".scatterplot").style("border", "2px solid " + this.getBorderColor());
        d3.select(".name_list").style("border", "2px solid " + this.getBorderColor());

    }

    getScatterplotPointsColors() {
        if(this.isDarkMode)
            return ['#2b77df', "#6d8181", "#F0F032", "#C32C01", "#A1DBFF", "#FFFFFF", "#FFA765"];
        else
            return ['black', "red", "blue", "yellow", "green", "pink", "orange"];
        /*
        if(this.isDarkMode && !this.isColorBlindnessMode)
            return 'red';
        else if(!this.isDarkMode && this.isColorBlindnessMode)
            return 'black';
        else if(this.isDarkMode && this.isColorBlindnessMode)
            return 'yellow';
        else
            return "#2b77df";
        */
    }

    getParallelNormalColor(){
        if(this.isDarkMode)
            return "rgb(70, 130, 180)";
        else
            return "rgb(70, 130, 180)";
    }

    getParallelSelectColor(){
        if(this.isDarkMode)
            return "green";
        else
            return "red";
    }

    getParallelBackColor(){
        if(this.isDarkMode)
            return "white";
        else
            return "#DCDCDC";
    }

}
