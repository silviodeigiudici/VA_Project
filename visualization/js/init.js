
var dataUpdater = new DataUpdater();

var scatterplot = new Scatterplot(dataUpdater);
var header = new Header(dataUpdater); 
var parallelPlot = new ParallelPlot(dataUpdater);


dataUpdater.header = header;

dataUpdater.loadData();
