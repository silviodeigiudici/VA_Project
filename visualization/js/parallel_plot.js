class ParallelPlot {
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater;

        var margin = { top: 20, right: 5, bottom: 5, left: 30 }
        var height = 300;
        var width = 800;
        this.height = height;
        this.width = width;
        this.svg = d3.select(".parallel_plot")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


        var referenceParallelPlot = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceParallelPlot.startVisualization(referenceParallelPlot);
        });
    }

    startVisualization(referenceParallelPlot) {
        //to see the data(you can delete this line, it's only an example):
        var dimensions = Object.keys(dataUpdater.data[0]).filter(function(d) { return d != "Current Version" && d !="Genres" && d !="Current Ver" && d != "comp0" && d!= "comp1" && d!="App" && d!="Type" && d!="LastUpdated"});
        var data = dataUpdater.data
        var i;
        console.log(dataUpdater.data[0])
        var y = {}
        //var c = {}
        c["Category"] =  d3.map(data, function(d){return(d.Category)}).keys().sort()
        c["ContentRating"] =  d3.map(data, function(d){return(d.ContentRating)}).keys().sort()

        //DA RIVEDERE, this part was used to get all dates and put it in a domain list, due to the nature of the data set, it can't be done without
        //modifying the csv first to comply with d3js

        //c["LastUpdated"] =  d3.map(data, function(d){return(d.LastUpdated)}).keys().sort() //change to A
/*
        var counter = 0
        var temp = []
        c["LastUpdated"] = []
        for (i in c["LastUpdatedA"]){
          console.log(c["LastUpdatedA"][i])
          if (counter%100 == 0){
            temp.push(c["LastUpdatedA"][i])
          }
          counter = counter+1
        }
        c["LastUpdated"] = temp
*/
        //This is used to split between categorical and numerical values since this version of d3js uses respectively scalePOint and scaleLinear
        //and we use the previously created domain lists to have their names on the axis.
        for (i in dimensions) {
          name = dimensions[i]
          if (name == "Category" || name == "ContentRating"){// || name == "LastUpdated"){
            y[name] = d3.scalePoint()
              .domain(c[name])
              .range([0, referenceParallelPlot.height])
          }
          else{
            y[name] = d3.scaleLinear()
              .domain( d3.extent(data, function(d) { return +d[name]; }) )
              .range([referenceParallelPlot.height, 0])
          }

        }

        // Build the X scale -> it find the best position for each Y axis
        var x = d3.scalePoint()
          .range([0, referenceParallelPlot.width])
          .padding(1)
          .domain(dimensions);

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
        }

        // Draw the lines
        referenceParallelPlot.svg
          .selectAll("myPath")
          .data(data)
          .enter().append("path")
          .attr("d",  path)
          .style("fill", "none")
          .style("stroke", "#69b3a2")
          .style("opacity", 0.5)

        // Draw the axis:
        referenceParallelPlot.svg.selectAll("myAxis")
          // For each dimension of the dataset I add a 'g' element:
          .data(dimensions).enter()
          .append("g")
          // I translate this element to its right position on the x axis
          .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
          // And I build the axis with the call function
          .each(function(d) {
            d3.select(this).call(d3.axisLeft().scale(y[d]));})
          // Add axis titles
          .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black")

    }

    updateVisualization() {

    }

}
