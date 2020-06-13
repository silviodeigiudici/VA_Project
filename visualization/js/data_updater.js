class DataUpdater {

    constructor() {
        this.eventsHandler = new EventTarget();
        this.brushedData = [];
        this.data = [];
        this.originalData = [];
        this.header = undefined;
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

        var referenceDataUpdater = this;
        
        this.originalData.forEach( function(row, index) {
            
            row.highlight = "0" //reset all the highlight value

            if( referenceDataUpdater.header.checkPaidFilter(row) && referenceDataUpdater.header.checkFreeFilter(row) )
                referenceDataUpdater.data.push( row );

        });

        this.brushedData = this.data;
        
        this.eventsHandler.dispatchEvent( new Event('typeUpdateVisualization') );
    }

    brushParallelUpdateData() {

        this.brushedData = [];

        var referenceDataUpdater = this;
        
        this.data.forEach( function(row, index) {
            
            if( true )
                referenceDataUpdater.brushedData.push( row );

        });

        this.eventsHandler.dispatchEvent( new Event('brushParallelUpdateVisualization') );

    }

    brushScatterUpdateData() {

        this.eventsHandler.dispatchEvent( new Event("brushScatterUpdateVisualization") );
    }

}

