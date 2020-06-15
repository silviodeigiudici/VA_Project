
var dataUpdater = new DataUpdater();
var colorUpdater = new ColorUpdater(dataUpdater);

var scatterplot = new Scatterplot(dataUpdater, colorUpdater);
var header = new Header(dataUpdater, colorUpdater);
var parallelPlot = new ParallelPlot(dataUpdater, colorUpdater);
var boxPlot = new BoxPlot1(dataUpdater, colorUpdater);
var histo_content = new HistoContent(dataUpdater, colorUpdater);
var histo_category = new HistoCategory(dataUpdater, colorUpdater);
var histo_version = new HistoVersion(dataUpdater, colorUpdater);
var name_list = new NameList(dataUpdater, colorUpdater);

dataUpdater.header = header;
dataUpdater.scatterplot = scatterplot;

dataUpdater.loadData();
