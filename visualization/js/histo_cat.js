class HistoCategory {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;

        var rect = d3.select(".barchart").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
        this.histoWidth = rect.width;
        this.histoHeight = rect.height;
        this.categories = []

        this.x = {}
        //40, 5, 10, 160
        var margin = { top: this.histoHeight * 0.11, right: this.histoWidth * 0.009, bottom: this.histoHeight * 0.03, left: this.histoWidth * 0.297 }
        //var margin = { top: 30, right: 5, bottom: 100, left: 60 }
        var height = this.histoHeight * 0.854; //350;
        var width = this.histoWidth * 0.66; //330;

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
            .attr("width", '100%')
            .attr("height", '100%')
            //.attr("preserveAspectRatio", "xMinYMin meet")
            //.attr("viewBox", "0 0 550 500")
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        var referenceHistogramCat = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceHistogramCat.startVisualization(referenceHistogramCat);
        });

    }

    startVisualization(referenceHistogramCat) {
        //to see the data(you can delete this line, it's only an example):
      var data = dataUpdater.brushedData;
      var dataObj = referenceHistogramCat.dataObjCreation(data)

      var x = d3.scaleLinear()
                .range([0, referenceHistogramCat.width]);

      // Scale the range of the data in the domains
      //var dom = dataObj.map(function(d) { return d.cat; })
      //y.domain(dom);
      x.domain([0, d3.max(dataObj, function(d) { return d.frequencies; })]);
      this.x = x;
      //this.y = y;
      //this.dom = dom;
      referenceHistogramCat.buildVisualization(referenceHistogramCat,dataObj);

      referenceHistogramCat.dataUpdater.addListener('brushParallelUpdateVisualization', function(e) {
          referenceHistogramCat.updateVisualization(referenceHistogramCat);
      });

      referenceHistogramCat.dataUpdater.addListener('typeUpdateVisualization', function(e) {
          referenceHistogramCat.updateVisualization(referenceHistogramCat);
      });

      referenceHistogramCat.dataUpdater.addListener('darkmodeUpdateColor', function(e) {
          referenceHistogramCat.changeColors(referenceHistogramCat);
      });

    }

    changeColors(referenceHistogramCat){


        referenceHistogramCat.svg.selectAll("text").style("fill", referenceHistogramCat.colorUpdater.getTextColor());

        referenceHistogramCat.svg.selectAll("line").style("stroke", referenceHistogramCat.colorUpdater.getAxesColor());

        referenceHistogramCat.svg.selectAll(".domain").style("stroke", referenceHistogramCat.colorUpdater.getAxesColor());

    }


    dataObjCreation(data){
        var i;
        var current;
        var occurances = {}
        var dat = []
        var categories = []
        var flag = false;

        if(this.categories.length != 0){
          flag = false;
          var categories = this.categories
        }
        else{
          flag = true;
          var categories = []
        }
        for (i in data){
          current = data[i].Category
          if (current == undefined){ //The dataset has some..imperfections
            continue
          }
          if (occurances[current] == undefined){
            occurances[current] = 1
            if(flag){
              categories.push(current)
            }
          }
          else{
            occurances[current] = occurances[current] + 1
          }
        }
      if(flag){
        this.categories = categories
      }

      var max = 0
      var count = categories.length
      for (i in occurances){
        dat[i] = []
        dat.push(occurances[i])
        if (occurances[i] > max){
          max = occurances[i]
        }
      }

      //Let's make bins for bar chart and sort it
      var dataObj = []
      for (let i = 0; i < count; i++) {
        if(occurances[categories[i]] == undefined){
          occurances[categories[i]] = 0;
        }
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
      .range([0, referenceHistogramCat.height])
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

    // draw the y Axis
    referenceHistogramCat.svg.append("g")
        .attr("class","axisY")
        .call(d3.axisLeft(y));

    // drwa the x Axis
    referenceHistogramCat.svg.append("g")
        .attr("class","axisX")
        .call(d3.axisTop(x));

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

    var rect = d3.select(".barchart").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
    this.histoWidth = rect.width;
    this.histoHeight = rect.height;


    //40, 5, 10, 160
    var margin = { top: this.histoHeight * 0.11, right: this.histoWidth * 0.009, bottom: this.histoHeight * 0.03, left: this.histoWidth * 0.297 }
    //var margin = { top: 30, right: 5, bottom: 100, left: 60 }
    var height = this.histoHeight * 0.854; //350;
    var width = this.histoWidth * 0.66; //330;

    var t1 = d3.transition()
        .duration(400);
    var t2 = d3.transition()
        .duration(200);

    var dataObj = referenceHistogramCat.dataObjCreation(referenceHistogramCat.dataUpdater.brushedData);
    var x = d3.scaleLinear()
              .range([0, referenceHistogramCat.width]);
    x.domain([0, d3.max(dataObj, function(d) { return d.frequencies; })]);

    var y = d3.scaleBand()
          .range([0, referenceHistogramCat.height])
          .padding(0.1)
          .domain( dataObj.map(function(d) {
            if(d.frequencies != 0){
              return d.cat; }}));

    referenceHistogramCat.svg.selectAll(".bar")
        .data(dataObj)
        .transition(t1)
        .attr("class", "bar")
        .attr("width", function(d) {return x(d.frequencies); } )
        .attr("y", function(d) { return y(d.cat); })
        .attr("height", y.bandwidth())
        .attr("fill", "#69b3a2");

    referenceHistogramCat.svg.select(".axisX")
        .transition(t2)
        .call(d3.axisTop(x));

    referenceHistogramCat.svg.select(".axisY")
        .transition(t1)
        .call(d3.axisLeft(y));

  }

}
