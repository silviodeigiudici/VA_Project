class BoxPlot1 {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;

        var rect = d3.select(".boxplot1").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
        this.boxWidth = rect.width;
        this.boxHeight = rect.height;


        var margin = { top: this.boxHeight * 0.1, right: this.boxWidth * 0.26, bottom: this.boxHeight * 0.144, left: this.boxWidth * 0.469 }
        var height = this.boxHeight * 0.8;
        var width = this.boxWidth * 0.16;
        this.minMax = {}
        this.minMax["Avg Rating"] = [0,0];
        this.minMax["Size"] = [0,0];
        this.minMax["#Reviews"] = [0,0];

        this.height = height;
        this.width = width;
        this.margin = margin;
        this.svg = d3.select(".boxplot1")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        this.svg1 = d3.select(".boxplot2")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        this.svg2 = d3.select(".boxplot3")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


        var referenceBoxPlot = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceBoxPlot.startVisualization(referenceBoxPlot);
        });

    }

    startVisualization(referenceBoxPlot) {
        //Let's make rate boxplot
        var data_s = dataUpdater.brushedData;
        var data_to_sort = []
        var i
        for (i in data_s){
          if(data_s[i] != "NaN"){
            data_to_sort.push(parseFloat(data_s[i].Rating))
          }
        }
        data_to_sort.pop() //One NaN is sneaking in somehow in the last loop..
        var data_sorted = data_to_sort.sort(d3.ascending)
        var min = data_sorted[0]
        var max = data_sorted[data_sorted.length-1]

        referenceBoxPlot.makeBoxPlot(referenceBoxPlot,referenceBoxPlot.svg,data_sorted,"Avg Rating",min,max)

        //Reviews boxplot
        data_to_sort = []
        for (i in data_s){
          if(data_s[i].Reviews != "NaN"){
            data_to_sort.push(parseInt(data_s[i].Reviews))
          }
        }
        data_to_sort.pop() //One NaN is sneaking in somehow in the last loop..
        data_sorted = data_to_sort.sort(d3.ascending)
        min = data_sorted[0]
        max = data_sorted[data_sorted.length-1]

        referenceBoxPlot.makeBoxPlot(referenceBoxPlot,referenceBoxPlot.svg1,data_sorted, "#Reviews",min,max)

        //Size boxplot
        data_to_sort = []
        for (i in data_s){
          if(data_s[i].Size != "NaN"){
            data_to_sort.push(parseInt(data_s[i].Size))
          }
        }
        data_to_sort.pop() //One NaN is sneaking in somehow in the last loop..
        data_sorted = data_to_sort.sort(d3.ascending)
        min = data_sorted[0]
        max = data_sorted[data_sorted.length-1]

        referenceBoxPlot.makeBoxPlot(referenceBoxPlot,referenceBoxPlot.svg2,data_sorted,"Size",min,max)


        referenceBoxPlot.dataUpdater.addListener('typeUpdateVisualization', function(e) {
            referenceBoxPlot.updateVisualization(referenceBoxPlot);
        });

        referenceBoxPlot.dataUpdater.addListener('brushParallelUpdateVisualization', function(e) {
            referenceBoxPlot.updateVisualization(referenceBoxPlot);
        });

        referenceBoxPlot.dataUpdater.addListener('darkmodeUpdateColor', function(e) {
            referenceBoxPlot.changeColors(referenceBoxPlot);
        });

      }

    changeColors(referenceBoxPlot){

        referenceBoxPlot.svg.selectAll("line").style("stroke", referenceBoxPlot.colorUpdater.getAxesColor());
        referenceBoxPlot.svg.selectAll("text").style("fill", referenceBoxPlot.colorUpdater.getTextColor());
        referenceBoxPlot.svg.selectAll(".domain").style("stroke", referenceBoxPlot.colorUpdater.getTextColor());
        referenceBoxPlot.svg.selectAll("rect").attr("stroke", referenceBoxPlot.colorUpdater.getAxesColor());

        referenceBoxPlot.svg1.selectAll("line").style("stroke", referenceBoxPlot.colorUpdater.getAxesColor());
        referenceBoxPlot.svg1.selectAll("text").style("fill", referenceBoxPlot.colorUpdater.getTextColor());
        referenceBoxPlot.svg1.selectAll(".domain").style("stroke", referenceBoxPlot.colorUpdater.getTextColor());
        referenceBoxPlot.svg1.selectAll("rect").attr("stroke", referenceBoxPlot.colorUpdater.getAxesColor());

        referenceBoxPlot.svg2.selectAll("line").style("stroke", referenceBoxPlot.colorUpdater.getAxesColor());
        referenceBoxPlot.svg2.selectAll("text").style("fill", referenceBoxPlot.colorUpdater.getTextColor());
        referenceBoxPlot.svg2.selectAll(".domain").style("stroke", referenceBoxPlot.colorUpdater.getTextColor());
        referenceBoxPlot.svg2.selectAll("rect").attr("stroke", referenceBoxPlot.colorUpdater.getAxesColor());

    }

    updateVisualization(referenceBoxPlot) {
      var rect = d3.select(".boxplot1").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
      this.boxWidth = rect.width;
      this.boxHeight = rect.height;

      var margin = { top: this.boxHeight * 0.1, right: this.boxWidth * 0.26, bottom: this.boxHeight * 0.144, left: this.boxWidth * 0.469 }
      var height = this.boxHeight * 0.8;
      var width = this.boxWidth * 0.16;

      this.height = height;
      this.width = width;
      this.margin = margin;

      var data_s = referenceBoxPlot.dataUpdater.brushedData;
      var data_to_sort = []
      var i

      d3.select(".boxplot1").select("svg").remove();

      this.svg = d3.select(".boxplot1")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
      for (i in data_s){
        if(data_s[i] != "NaN"){
          data_to_sort.push(parseFloat(data_s[i].Rating))
        }
      }
      data_to_sort.pop() //One NaN is sneaking in somehow in the last loop..
      var data_sorted = data_to_sort.sort(d3.ascending)
      var min = data_sorted[0]
      var max = data_sorted[data_sorted.length-1]
      referenceBoxPlot.makeBoxPlot(referenceBoxPlot,referenceBoxPlot.svg,data_sorted,"Avg Rating",min,max)


      d3.select(".boxplot2").select("svg").remove();

      this.svg1 = d3.select(".boxplot2")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      //Reviews boxplot
      data_to_sort = []
      for (i in data_s){
        if(data_s[i].Reviews != "NaN"){
          data_to_sort.push(parseInt(data_s[i].Reviews))
        }
      }
      data_to_sort.pop() //One NaN is sneaking in somehow in the last loop..
      data_sorted = data_to_sort.sort(d3.ascending)
      min = data_sorted[0]
      max = data_sorted[data_sorted.length-1]

      referenceBoxPlot.makeBoxPlot(referenceBoxPlot,referenceBoxPlot.svg1,data_sorted,"#Reviews",min,max)

      d3.select(".boxplot3").select("svg").remove();

      this.svg2 = d3.select(".boxplot3")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
      //Size boxplot
      data_to_sort = []
      for (i in data_s){
        if(data_s[i].Size != "NaN"){
          data_to_sort.push(parseInt(data_s[i].Size))
        }
      }
      data_to_sort.pop() //One NaN is sneaking in somehow in the last loop..
      data_sorted = data_to_sort.sort(d3.ascending)

      min = data_sorted[0]
      max = data_sorted[data_sorted.length-1]

      referenceBoxPlot.makeBoxPlot(referenceBoxPlot,referenceBoxPlot.svg2,data_sorted,"Size",min,max)

    }



makeBoxPlot(referenceBoxPlot,svg,data_sorted,axName,min,max){
  // Compute summary statistics used for the box:
    var t1 = d3.transition()
        .duration(200);

    if(data_sorted.length == 0){
      min = referenceBoxPlot.minMax[axName][0]
      max = referenceBoxPlot.minMax[axName][1]
      var q1 = 0
      var median = 0
      var q3 = 0
      var interQuantileRange = 0
    }
    else{
      referenceBoxPlot.minMax[axName][0] = min
      referenceBoxPlot.minMax[axName][1] = max

      var q1 = d3.quantile(data_sorted, .25)
      var median = d3.quantile(data_sorted, .5)
      var q3 = d3.quantile(data_sorted, .75)
      var interQuantileRange = q3 - q1
    }

    // Show the Y scale
    var y = d3.scaleLinear()
      .domain([min,max])
      .range([referenceBoxPlot.height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - referenceBoxPlot.margin.left )
        .attr("x",0 - referenceBoxPlot.height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(axName);

    // a few features for the box
    var center = 40
    var width = 30

    // Show the main vertical line
    svg
      .append("line")
        .attr("x1", center)
        .attr("x2", center)
        .attr("y1", y(min) )
        .attr("y2", y(max) )
        .attr("stroke", "black")

    // Show the box
    svg
      .append("rect")
        .transition(t1)
        .attr("x", center - width/2)
        .attr("y", y(q3) )
        .attr("height", (y(q1)-y(q3)) )
        .attr("width", referenceBoxPlot.width )
        .attr("stroke", "black")
        .attr("fill", "#69b3a2")

    // show median, min and max horizontal lines
    svg
      .selectAll("toto")
      .data([min, median, max])
      .enter()
      .append("line")
        .attr("x1", center-referenceBoxPlot.width/2)
        .attr("x2", center+referenceBoxPlot.width/2)
        .attr("y1", function(d){ return(y(d))} )
        .attr("y2", function(d){ return(y(d))} )
        .attr("stroke", "black")
}
}
