class HistoContent {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;
        this.categories = []
        var rect = d3.select(".histo_content").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
        this.histoWidth = rect.width;
        this.histoHeight = rect.height;

        var margin = { top: this.histoHeight * 0.082, right: this.histoWidth * 0.00923, bottom: this.histoHeight * 0.27, left: this.histoWidth * 0.111 }
        var height = this.histoHeight * 0.79; //350;
        var width = this.histoWidth * 0.775; //330;

        this.height = height;
        this.width = width;
        this.margin = margin;

        this.svg = d3.select(".histo_content")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        var referenceHistogram = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceHistogram.startVisualization(referenceHistogram);
        });

    }

    startVisualization(referenceHistogram) {

        var x = d3.scaleBand()
                  .range([0, referenceHistogram.width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([referenceHistogram.height, 0]);

        var dataObj = referenceHistogram.dataObjCreation(referenceHistogram.dataUpdater.brushedData);
        // get the data
        // format the data
        // Scale the range of the data in the domains
        x.domain(dataObj.map(function(d) { return d.cat; }));
        y.domain([0, d3.max(dataObj, function(d) { return d.frequencies; })]);
        this.x = x;
        this.y = y;

        referenceHistogram.buildVisualization(referenceHistogram,dataObj);

        referenceHistogram.dataUpdater.addListener('brushParallelUpdateVisualization', function(e) {
            referenceHistogram.updateVisualization(referenceHistogram);
        });

        referenceHistogram.dataUpdater.addListener('typeUpdateVisualization', function(e) {
            referenceHistogram.updateVisualization(referenceHistogram);
        });

        referenceHistogram.dataUpdater.addListener('darkmodeUpdateColor', function(e) {
            referenceHistogram.changeColors(referenceHistogram);
        });

    }

    changeColors(referenceHistogram){

        referenceHistogram.svg.selectAll("text").style("fill", referenceHistogram.colorUpdater.getTextColor());

        referenceHistogram.svg.selectAll("line").style("stroke", referenceHistogram.colorUpdater.getAxesColor());

        referenceHistogram.svg.selectAll(".domain").style("stroke", referenceHistogram.colorUpdater.getAxesColor());

    }


    dataObjCreation(data){
      var i;
      var current;
      var flag
      var occurances = {}
      var dat = []

      var max = 0
      if(this.categories.length != 0){
        flag = false;
        var categories = this.categories;
      }
      else{
        flag = true;
        var categories = []
      }
      for (i in data){
        current = data[i].ContentRating
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
      var count = categories.length
      for (i in occurances){
        dat[i] = []
        dat.push(occurances[i])
        if (occurances[i] > max){
          max = occurances[i]
        }
      }

      var dataObj = []
      for (let i = 0; i < count; i++) {
        if(occurances[categories[i]] == undefined){
          occurances[categories[i]] = 0;
        }
        dataObj[i] = {
          cat: categories[i],
          frequencies: occurances[categories[i]]
          }
      }
      return(dataObj)
    }


    buildVisualization(referenceHistogram,dataObj){
      var y = referenceHistogram.y;
      var x = referenceHistogram.x;
      // append the rectangles for the bar chart
      referenceHistogram.svg.selectAll(".bar")
        .data(dataObj)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return x(d.cat); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.frequencies); })
          .attr("height", function(d) { return referenceHistogram.height - y(d.frequencies); })
          .attr("fill", "#69b3a2");

      // add the x Axis
      referenceHistogram.svg.append("g")
          .attr("transform", "translate(0," + referenceHistogram.height + ")")
          .attr("class","axisX")
          .call(d3.axisBottom(x));

      referenceHistogram.svg.append("text")
          .attr("transform",
                "translate(" + ((referenceHistogram.width)/2) + " ,0" +
                               (referenceHistogram.height + 35) + ")")
          .style("text-anchor", "middle")
          .text("Content Rating");

      // add the y Axis
      referenceHistogram.svg.append("g")
        .attr("class","axisY")
          .call(d3.axisLeft(y));
    }

    updateVisualization(referenceHistogram) {

      var margin = referenceHistogram.margin;
      var height = referenceHistogram.height;
      var width = referenceHistogram.width;
      this.height = height;
      this.width = width;

      var dataObj = referenceHistogram.dataObjCreation(referenceHistogram.dataUpdater.brushedData);

      var t1 = d3.transition()
          .duration(400);
      var t2 = d3.transition()
          .duration(200);

      var x = d3.scaleBand()
                .range([0, referenceHistogram.width])
                .padding(0.1);
      var y = d3.scaleLinear()
                .range([referenceHistogram.height, 0]);
      x.domain(dataObj.map(function(d) { return d.cat; }));
      y.domain([0, d3.max(dataObj, function(d) { return d.frequencies; })]);


      //let's create the transition and apply it to the bars with new data
      var t1 = d3.transition()
          .duration(400);
      referenceHistogram.svg.selectAll(".bar")
        .data(dataObj)
        .transition(t1)
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.cat); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.frequencies); })
        .attr("height", function(d) {
          return referenceHistogram.height - y(d.frequencies); })
        .attr("fill", "#69b3a2");

      referenceHistogram.svg.select(".axisX")
          .transition(t2)
          .call(d3.axisBottom(x));

      referenceHistogram.svg.select(".axisY")
          .transition(t1)
          .call(d3.axisLeft(y));



    }

}
