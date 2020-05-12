
var dataUpdater = new DataUpdater();

var scatterplot = new Scatterplot(dataUpdater);
var header = new Header(dataUpdater);
var parallelPlot = new ParallelPlot(dataUpdater);
var boxPlot = new BoxPlot1(dataUpdater);


dataUpdater.header = header;

dataUpdater.loadData();
