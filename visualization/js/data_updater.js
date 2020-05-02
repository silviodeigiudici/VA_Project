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
        console.log("Update Data");
    }
}

