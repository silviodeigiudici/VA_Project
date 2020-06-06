
var dataUpdater = new DataUpdater();

var scatterplot = new Scatterplot(dataUpdater);
var header = new Header(dataUpdater);
var parallelPlot = new ParallelPlot(dataUpdater);
var boxPlot = new BoxPlot1(dataUpdater);
var histo_content = new HistoContent(dataUpdater);
var histo_category = new HistoCategory(dataUpdater);
var histo_version = new HistoVersion(dataUpdater);

dataUpdater.header = header;

dataUpdater.loadData();
