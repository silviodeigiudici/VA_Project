class DataUpdater {

    constructor() {
        this.eventsHandler = new EventTarget();
        this.data = [];
    }

    loadData() {
        var referenceDataUpdater = this; //used in csv function

        d3.csv("./data/data.csv", function (loadedData) {
            referenceDataUpdater.data = loadedData;
            referenceDataUpdater.eventsHandler.dispatchEvent( new Event('dataReady') );
        });
    }

    addListener(nameEvent, handler) {
        this.eventsHandler.addEventListener(nameEvent, handler);
    }
}

var dataUpdater = new DataUpdater();
dataUpdater.loadData();
