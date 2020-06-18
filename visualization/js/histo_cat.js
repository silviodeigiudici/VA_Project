class HistoCategory {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;

        var margin = { top: 50, right: 5, bottom: 10, left: 160 }
        var height = 350  ;
        var width = 330;
        var x = {};
        var y = {};
        var dom = {};
        this.dom = dom;
        this.height = height;
        this.width = width;
        this.margin = margin;
        this.categories = []
        this.svg = d3.select(".barchart")
          .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 550 500")
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        var referenceHistogramCat = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceHistogramCat.startVisualization(referenceHistogramCat);
        });
        this.dataUpdater.addListener('typeUpdateVisualization', function(e) {
            referenceHistogramCat.updateVisualization(referenceHistogramCat);
        });
    }

    startVisualization(referenceHistogramCat) {
        //to see the data(you can delete this line, it's only an example):
      var data = dataUpdater.brushedData;
      var dataObj = referenceHistogramCat.dataObjCreation(data)
      //console.log(dataObj)

      //Making x and y axis
      var y = d3.scaleBand()
        .range([0, referenceHistogramCat.width])
        .padding(0.1);
      var x = d3.scaleLinear()
                .range([0, referenceHistogramCat.height]);

      // Scale the range of the data in the domains
      var dom = dataObj.map(function(d) { return d.cat; })
      y.domain(dom);
      x.domain([0, d3.max(dataObj, function(d) { return d.frequencies; })]);
      this.x = x;
      this.y = y;
      this.dom = dom;
      referenceHistogramCat.buildVisualization(referenceHistogramCat,dataObj);

      referenceHistogramCat.dataUpdater.addListener('brushParallelUpdateVisualization', function(e) {
          referenceHistogramCat.updateVisualization(referenceHistogramCat);
      });
}
    dataObjCreation(data){
        var i;
        var current;
        var occurances = {}
        var dat = []
        var categories = []
        for (i in data){
          current = data[i].Category
          if (current == undefined){ //The dataset has some..imperfections
            continue
          }
          if (occurances[current] == undefined){
            occurances[current] = 1
            categories.push(current)
          }
          else{
            occurances[current] = occurances[current] + 1
          }
        }
      var max = 0
      var count = 0
      for (i in occurances){
        count = count +1
        dat[i] = []
        dat.push(occurances[i])
        if (occurances[i] > max){
          max = occurances[i]
        }
      }

      //Let's make bins for bar chart and sort it
      var dataObj = []
      for (let i = 0; i < count; i++) {
      dataObj.push({
        cat: categories[i],
        frequencies: occurances[categories[i]]
        })
      }
      dataObj.sort((a, b) => (a.frequencies < b.frequencies) ? 1 : -1)
      if (this.categories.length < categories.length){
        this.categories = categories
      }
      return(dataObj)
    }

  buildVisualization(referenceHistogramCat,dataObj){
    var y = d3.scaleBand()
      .range([0, referenceHistogramCat.width])
      .padding(0.1);
    var dom =  dataObj.map(function(d) { return d.cat; })

    var i;
    for (i in this.categories){
      if (!dom.includes(this.categories[i])){
        dom.push(this.categories[i]);
      }
    }
    y.domain(dom)

    var x = referenceHistogramCat.x;
    // append the rectangles for the bar chart
    referenceHistogramCat.svg.selectAll(".bar")
        .data(dataObj)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("width", function(d) {return x(d.frequencies); } )
          .attr("y", function(d) { return y(d.cat); })
          .attr("height", y.bandwidth())
          .attr("fill", "#69b3a2");

    // drwa the x Axis
    referenceHistogramCat.svg.append("g")
        .call(d3.axisTop(x));

    //label x Axis
    referenceHistogramCat.svg.append("text")
        .attr("transform",
              "translate(" + ((referenceHistogramCat.width)/2) + " ," + "-" + referenceHistogramCat.margin.top/2 + ")")
        .style("text-anchor", "middle")
        .text("Apps");

    // draw the y Axis
    referenceHistogramCat.svg.append("g")
        .call(d3.axisLeft(y));
    //label y Axis
    referenceHistogramCat.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - referenceHistogramCat.margin.left)
        .attr("x",0 - (referenceHistogramCat.height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Category");
  }

  updateVisualization(referenceHistogramCat) {
    //here you need to update the visualization taking the new data from:
    //referenceHistogram.dataUpdater.data
    var margin = { top: 50, right: 5, bottom: 10, left: 160 }
    var height = 350  ;
    var width = 330;
    this.height = height;
    this.width = width;
    d3.select(".barchart").select("svg").remove();
    this.svg = d3.select(".barchart")
      .append("svg")
        .attr("width", '100%')
        .attr("height", '100%')
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    referenceHistogramCat = this;
    var dataObj = referenceHistogramCat.dataObjCreation(referenceHistogramCat.dataUpdater.brushedData);

    referenceHistogramCat.buildVisualization(referenceHistogramCat,dataObj);

  }

}
