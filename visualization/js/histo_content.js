class HistoContent {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;


        var rect = d3.select(".histo_content").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
        this.histoWidth = rect.width;
        this.histoHeight = rect.height;
        //console.log(this.histoWidth);
        //console.log(this.histoHeight);

        var margin = { top: this.histoHeight * 0.082, right: this.histoWidth * 0.00923, bottom: this.histoHeight * 0.27, left: this.histoWidth * 0.111 }

        var height = this.histoHeight * 0.79; //350;
        var width = this.histoWidth * 0.775; //330;


        //var margin = { top: 30, right: 5, bottom: 100, left: 60 }
        //var height = 300;
        //var width = 420;


        this.height = height;
        this.width = width;
        this.margin = margin;
        var x = {};
        var y = {};

        this.svg = d3.select(".histo_content")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            //.attr("preserveAspectRatio", "xMinYMin meet")
            //.attr("viewBox", "0 0 500 400")
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        var referenceHistogram = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceHistogram.startVisualization(referenceHistogram);
        });

    }

    startVisualization(referenceHistogram) {
        //to see the data(you can delete this line, it's only an example):


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
      var occurances = {}
      var dat = []
      var categories = []
      for (i in data){
        current = data[i].ContentRating
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

      var dataObj = []
      for (let i = 0; i < count; i++) {
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

      /* #Label over bars, need fixing
      referenceHistogram.svg.selectAll(".bar")
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", function(d) { return y(d.frequencies)+500; })
        .attr("x", function(d) { return x(d.cat); })
        .text(function(d) { return d.frequencies; })
        .style("fill", "black")
*/
      // add the x Axis
      referenceHistogram.svg.append("g")
          .attr("transform", "translate(0," + referenceHistogram.height + ")")
          .call(d3.axisBottom(x));
      referenceHistogram.svg.append("text")
          .attr("transform",
                "translate(" + ((referenceHistogram.width)/2) + " ,0" +
                               (referenceHistogram.height + 35) + ")")
          .style("text-anchor", "middle")
          .text("Content Rating");

      // add the y Axis
      referenceHistogram.svg.append("g")
          .call(d3.axisLeft(y));
      referenceHistogram.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - referenceHistogram.margin.left)
          .attr("x",0 - (referenceHistogram.height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Apps");

    }
    updateVisualization(referenceHistogram) {

      //here you need to update the visualization taking the new data from:
      //referenceHistogram.dataUpdater.data
      var margin = referenceHistogram.margin;
      var height = referenceHistogram.height;
      var width = referenceHistogram.width;
      this.height = height;
      this.width = width;


      var x = referenceHistogram.x
      var y = referenceHistogram.y
      var dataObj = referenceHistogram.dataObjCreation(referenceHistogram.dataUpdater.brushedData);
      var t1 = d3.transition()
          .duration(2000);
      referenceHistogram.svg.selectAll(".bar")
        .data(dataObj)
        .transition(t1  )
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.cat); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.frequencies); })
        .attr("height", function(d) { return referenceHistogram.height - y(d.frequencies); })
        .attr("fill", "#69b3a2");
      //referenceHistogram = this;
      //referenceHistogram.buildVisualization(referenceHistogram,dataObj);


    }

}
