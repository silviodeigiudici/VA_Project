class ColorUpdater {
    
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater;
        
        this.isDarkMode = false;
        //this.isColorBlindnessMode = false; //used? boh

        this.darkmode_button = document.getElementById("darkmode_button");
        //this.blind_buttom = document.getElementById("blind_button");
        
        var referenceColorUpdater = this;

        this.darkmode_button.addEventListener('click', function() {
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

    getImgButton() {
        if(this.isDarkMode) return "./res/25665_on.svg";
        else return "./res/25665_off.svg";
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

        document.getElementById('darkmode_img').src = this.getImgButton();

    }

    getScatterplotPointsColors() {
        if(this.isDarkMode)
            //return ['#2b77df', "#6d8181", "#F0F032", "#C32C01", "#A1DBFF", "#FFFFFF", "#FFA765"];
            return ['#1b9e77',"#d95f02","#7570b3","#e7298a","#66a61e","#FFFFFF","#a6761d"];
        else
            //return ['black', "red", "blue", "yellow", "green", "pink", "orange"];
            return ['#1b9e77',"#d95f02","#7570b3","#e7298a","#66a61e","#666666","#a6761d"]
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
            return "#69b3a2";
        else
            return "#69b3a2";
    }

    getParallelSelectColor(){
        if(this.isDarkMode)
            return '#e41a1c';
        else
            return '#e41a1c';
    }

    getParallelBackColor(){
        if(this.isDarkMode)
            return '#595953';
        else
            return '#ddd';
    }

}
