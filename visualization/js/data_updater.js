class DataUpdater {

    constructor() {
        this.eventsHandler = new EventTarget();
        this.brushedData = [];
        this.data = [];
        this.originalData = [];
        this.header = undefined;
        this.scatterplot = undefined;
        this.parallelPlot = undefined;
    }

    loadData() {
        var referenceDataUpdater = this; //used in csv function

        d3.csv("./data/data.csv", function (loadedData) {
            referenceDataUpdater.originalData = loadedData;
            referenceDataUpdater.data = loadedData;
            referenceDataUpdater.brushedData = loadedData;
            referenceDataUpdater.eventsHandler.dispatchEvent( new Event('dataReady') );
        });
    }

    addListener(nameEvent, handler) {
        this.eventsHandler.addEventListener(nameEvent, handler);
    }

    typeUpdateData() {

        this.data = [];
        this.brushedData = [];

        var referenceDataUpdater = this;

        this.originalData.forEach( function(row, index) {

            if( referenceDataUpdater.header.checkPaidFilter(row) && referenceDataUpdater.header.checkFreeFilter(row) && referenceDataUpdater.header.checkLastUpdate(row) ){
                
                referenceDataUpdater.data.push( row );

                if( referenceDataUpdater.parallelPlot.checkParallelFilter(row) )
                    referenceDataUpdater.brushedData.push( row );
            
            }
        });

        this.eventsHandler.dispatchEvent( new Event('typeUpdateVisualization') );
    }

    brushParallelUpdateData() {

        this.brushedData = [];

        var referenceDataUpdater = this;

        this.data.forEach( function(row, index) {

            if( referenceDataUpdater.parallelPlot.checkParallelFilter(row) )
                referenceDataUpdater.brushedData.push( row );

        });

        this.eventsHandler.dispatchEvent( new Event('brushParallelUpdateVisualization') );

    }

    checkScatterplotFilter(row){

        return this.scatterplot.checkScatterplotFilter(row);

    }

    brushScatterUpdateData() {

        this.eventsHandler.dispatchEvent( new Event("brushScatterUpdateVisualization") );

    }

    darkmodeUpdateColor(){

        this.eventsHandler.dispatchEvent( new Event('darkmodeUpdateColor') );

    }

    blindmodeUpdateColor(){


        this.eventsHandler.dispatchEvent( new Event('blindmodeUpdateColor') );

    }
}
