class DataUpdater {

    constructor() {
        this.eventsHandler = new EventTarget();
        this.data = [];
        this.originalData = [];
        this.header = undefined;
    }

    loadData() {
        var referenceDataUpdater = this; //used in csv function

        d3.csv("./data/data.csv", function (loadedData) {
            referenceDataUpdater.originalData = loadedData;
            referenceDataUpdater.data = loadedData;
            referenceDataUpdater.eventsHandler.dispatchEvent( new Event('dataReady') );
        });
    }

    addListener(nameEvent, handler) {
        this.eventsHandler.addEventListener(nameEvent, handler);
    }

    updateData() {
        //for all originalData rows  
        //console.log("Update Data");
        this.data = [];

        var referenceDataUpdater = this;
        this.originalData.forEach( function(row, index) {
            if( referenceDataUpdater.header.checkPaidFilter(row) && referenceDataUpdater.header.checkFreeFilter(row) )
                referenceDataUpdater.data.push( row );
        });
        //console.log(this.data);
        this.eventsHandler.dispatchEvent( new Event('updateVisualization') );
    }
}

