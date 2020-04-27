DataUpdater = function () {
    this.eventsHandler = new EventTarget();
    this.data = [];
}

DataUpdater.prototype.loadData = function () {
    
    referenceDataUpdater = this; //used in csv function

    d3.csv("./data/data.csv", function (loadedData) {
        referenceDataUpdater.data = loadedData;
        referenceDataUpdater.eventsHandler.dispatchEvent( new Event('dataReady') );
    });
}

DataUpdater.prototype.addListener = function (nameEvent, handler) {
    this.eventsHandler.addEventListener(nameEvent, handler);
}

var dataUpdater = new DataUpdater();
dataUpdater.loadData();
