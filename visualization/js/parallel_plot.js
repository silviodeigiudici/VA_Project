class ParallelPlot {
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater;

        var margin = { top: 25, right: 5, bottom: 5, left: 20 }
        var height = 400;
        var width = 1100;
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
        var dimensions = Object.keys(dataUpdater.data[0]).filter(function(d) { return d != "Current Version" && d != "highlight" && d !="Genres" && d !="Current Ver" && d != "comp0" && d!= "comp1" && d!="App" && d!="Type" && d!="LastUpdated"});
        var data = dataUpdater.data
        var i;
        var y = {}
        var dragging = {}
        var c = {}
        c["Category"] =  d3.map(data, function(d){return(d.Category)}).keys().sort()
        c["ContentRating"] =  d3.map(data, function(d){return(d.ContentRating)}).keys().sort()

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
        var line = d3.line(),
                  background,
                  foreground,
                  extents;

        // Add grey background lines for context.
        background = referenceParallelPlot.svg.append("g")
            .attr("class", "background")
          .selectAll("path")
            .data(data)
          .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = referenceParallelPlot.svg.append("g")
            .attr("class", "foreground")
          .selectAll("path")
            .data(data)
          .enter().append("path")
            .attr("d", path);

        extents = dimensions.map(function(p) { return [0,0]; });

          // Add a group element for each dimension.
          var g = referenceParallelPlot.svg.selectAll(".dimension")
              .data(dimensions)
            .enter().append("g")
              .attr("class", "dimension")
              .attr("transform", function(d) {  return "translate(" + x(d) + ")"; })
              .call(d3.drag()
                .subject(function(d) { return {x: x(d)}; })
                .on("start", function(d) {
                  dragging[d] = x(d);
                  background.attr("visibility", "hidden");
                })
                .on("drag", function(d) {
                  dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                  foreground.attr("d", path);
                  dimensions.sort(function(a, b) { return position(a) - position(b); });
                  x.domain(dimensions);
                  g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
                })
                .on("end", function(d) {
                  delete dragging[d];
                  transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                  transition(foreground).attr("d", path);
                  background
                      .attr("d", path)
                    .transition()
                      .delay(500)
                      .duration(0)
                      .attr("visibility", null);
                }));


          // Add an axis and title.
          var g = referenceParallelPlot.svg.selectAll(".dimension");
          g.append("g")
              .attr("class", "axis")
              .each(function(d) {  d3.select(this).call(d3.axisLeft(y[d]));})
              //text does not show up because previous line breaks somehow
            .append("text")
              .attr("fill", "black")
              .style("text-anchor", "middle")
              .attr("y", -9)
              .text(function(d) { return d; });

          // Add and store a brush for each axis.
          g.append("g")
              .attr("class", "brush")
              .each(function(d) {
                if(d == 'Category' || d == "ContentRating"){
                  d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [15,referenceParallelPlot.height]]).on("brush start", brushstart).on("brush", go_brush).on("brush", brush_parallel).on("end", brush_end_ordinal));
                }

              else{
                  d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [8,referenceParallelPlot.height]]).on("brush start", brushstart).on("brush", go_brush).on("brush", brush_parallel_chart).on("end", brush_end));
                  }

              })
            .selectAll("rect")
              .attr("x", -8)
              .attr("width", 16);

        function position(d) {
          var v = dragging[d];
          return v == null ? x(d) : v;
        }

        function transition(g) {
          return g.transition().duration(500);
        }

        // Returns the path for a given data point.
        function path(d) {
          return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
        }

        function go_brush() {
          d3.event.sourceEvent.stopPropagation();
        }


        var invertExtent = function(y) {
          return domain.filter(function(d, i) { return y === range[i]; });
        };


        function brushstart(selectionName) {

          foreground.style("display", "none")
          var dimensionsIndex = dimensions.indexOf(selectionName);
          extents[dimensionsIndex] = [0, 0];

          foreground.style("display", function(d) {
            return dimensions.every(function(p, i) {
                if(extents[i][0]==0 && extents[i][0]==0) {
                    return true;
                }
              return extents[i][1] <= d[p] && d[p] <= extents[i][0];
            }) ? null : "none";
          });
        }

        // Handles a brush event, toggling the display of foreground lines.
        function brush_parallel_chart() {

           for(var i=0;i<dimensions.length;++i){

                if(d3.event.target==y[dimensions[i]].brush) {
                 //if (d3.event.sourceEvent.type === "brush") return;

                    extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);

            }

        }

             foreground.style("display", function(d) {
                return dimensions.every(function(p, i) {
                    if(extents[i][0]==0 && extents[i][0]==0) {
                        return true;
                    }
                  return extents[i][1] <= d[p] && d[p] <= extents[i][0];
                }) ? null : "none";
              });
        }


        function brush_end(){
          if (!d3.event.sourceEvent) return; // Only transition after input.
          if (!d3.event.selection) return; // Ignore empty selections.


        for(var i=0;i<dimensions.length;++i){
           if(d3.event.target==y[dimensions[i]].brush) {
            extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);
            extents[i][0] = Math.round( extents[i][0] * 10 ) / 10;
            extents[i][1] = Math.round( extents[i][1] * 10 ) / 10;

            d3.select(this).transition().call(d3.event.target.move, extents[i].map(y[dimensions[i]]));
            }
          }

        }

        //   brush for ordinal cases
        function brush_parallel() {

          for(var i=0;i<dimensions.length;++i){

                  if(d3.event.target==y[dimensions[i]].brush) {

                     var  yScale = y[dimensions[i]];
                     var selected =  yScale.domain().filter(function(d){
                                     var s = d3.event.selection;
                                     return (s[0] <= yScale(d)) && (yScale(d) <= s[1])
                                });

                  var temp = selected.sort();
                  extents[i] = [temp[temp.length-1], temp[0]];
                  }
          }

          foreground.style("display", function(d) {
                  return dimensions.every(function(p, i) {
                      if(extents[i][0]==0 && extents[i][0]==0) {
                          return true;
                      }
                  return extents[i][1] <= d[p] && d[p] <= extents[i][0];
                  }) ? null : "none";
                });
        }



      function brush_end_ordinal(){
        if (!d3.event.sourceEvent) return; // Only transition after input.

        if (!d3.event.selection) return; // Ignore empty selections.

        for(var i=0;i<dimensions.length;++i){
              if(d3.event.target==y[dimensions[i]].brush) {
                var  yScale = y[dimensions[i]];
                var selected =  yScale.domain().filter(function(d){
                                var s = d3.event.selection;
                                return (s[0] <= yScale(d)) && (yScale(d) <= s[1])
                                });
                var temp = selected.sort();
                //console.log(temp)
                extents[i] = [temp[temp.length-1], temp[0]];
           }
       }
    }


}

    updateVisualization() {

    }

}
