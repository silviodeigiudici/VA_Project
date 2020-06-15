class ParallelPlot {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;
        this.x = {};
        this.y = {};
        this.c = {};
        this.dimensions = {}
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
            referenceParallelPlot.startVisualization(referenceParallelPlot,dataUpdater.data);
        });
    }

    startVisualization(referenceParallelPlot, currentData) {
        //the commented line breaks when the user deselects paid and free :(
        //var dimensions = Object.keys(currentData[0]).filter(function(d) { return d != "Current Version" && d != "highlight" && d !="Genres" && d !="Current Ver" && d != "comp0" && d!= "comp1" && d!="App" && d!="Type" && d!="LastUpdated"});
        var dimensions = [ "Category", "Rating", "Reviews", "Size", "Installs", "Price", "ContentRating", "AndroidVer" ]
        referenceParallelPlot.dimensions = dimensions
        var data = currentData
        var i;
        var y = {}
        var c = {}

        var filters = {}
        c["Category"] =  d3.map(data, function(d){return(d.Category)}).keys().sort()
        c["ContentRating"] =  d3.map(data, function(d){return(d.ContentRating)}).keys().sort()

        //This is used to split between categorical and numerical values since this version of d3js uses respectively scalePOint and scaleLinear
        //and we use the previously created domain lists to have their names on the axis.
        for (i in dimensions) {
          filters[dimensions[i]] = []
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
        referenceParallelPlot.y = y;
        referenceParallelPlot.x = x;
        referenceParallelPlot.c = c;
        referenceParallelPlot.filters = filters;
        referenceParallelPlot.buildVisualization(referenceParallelPlot,data);

        //###########################################################
        //EVENTS HANDLING, MUST BE AT THE END OF STARTVISUALIZATION
        //###########################################################


        referenceParallelPlot.dataUpdater.addListener('typeUpdateVisualization', function(e) {
            referenceParallelPlot.updateVisualization(referenceParallelPlot);
        });

        referenceParallelPlot.dataUpdater.addListener('brushScatterUpdateVisualization', function(e) {
            referenceParallelPlot.highlightBrushedPoints(referenceParallelPlot, e);
        });

        referenceParallelPlot.dataUpdater.addListener('darkmodeUpdateColor', function(e) {
            referenceParallelPlot.changeVisualizationColor(referenceParallelPlot);
        });

  }

      buildVisualization(referenceParallelPlot,data){
        var y = referenceParallelPlot.y
        var x = referenceParallelPlot.x
        var c = referenceParallelPlot.c
        var dimensions = referenceParallelPlot.dimensions
        var dragging = {}
        var filters = referenceParallelPlot.filters
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
            if (!d3.event.selection){
            //Reset selection!
              for(var i=0;i<dimensions.length;++i){
                  if(d3.event.target==y[dimensions[i]].brush) {
                    filters[dimensions[i]] = []
                  }
              }
              //console.log(filters)
              return; // Ignore empty selections.
            }

            for(var i=0;i<dimensions.length;++i){
                if(d3.event.target==y[dimensions[i]].brush) {
                    console.log(dimensions[i])
                    extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);
                    extents[i][0] = Math.round( extents[i][0] * 10 ) / 10;
                    extents[i][1] = Math.round( extents[i][1] * 10 ) / 10;
                    var ax = dimensions[i];
                    var limitRange = [extents[i][1],extents[i][0]]
                    d3.select(this).transition().call(d3.event.target.move, extents[i].map(y[dimensions[i]]));
                }
            }
            filters[ax] = limitRange
            console.log(filters)
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

          if (!d3.event.selection) {
            //Reset selection!
            for(var i=0;i<dimensions.length;++i){
              if(d3.event.target==y[dimensions[i]].brush) {
                filters[dimensions[i]] = []
              }
            }
            console.log(filters)
            return; // Ignore empty selections.
          }
          for(var i=0;i<dimensions.length;++i){
                if(d3.event.target==y[dimensions[i]].brush) {
                  var  yScale = y[dimensions[i]];
                  var selected =  yScale.domain().filter(function(d){
                                  var s = d3.event.selection;
                                  return (s[0] <= yScale(d)) && (yScale(d) <= s[1])
                                  });
                  var temp = selected.sort();
                  var ax = dimensions[i];
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
          //temp contains all selected elements
          //Now filters contains all elements to remove
          filters[ax] = temp
          //console.log(filters)
          //triggerBrushing(referenceParallelPlot,brushData)
        }

    }

    updateVisualization(referenceParallelPlot) {

        //here you need to update the visualization taking the new data from:
        //referenceParallelPlot.dataUpdater.data
        var margin = { top: 25, right: 5, bottom: 5, left: 20 }
        var height = 400;
        var width = 1100;
        this.height = height;
        this.width = width;
        d3.select(".parallel_plot").select("svg").remove();
        referenceParallelPlot.svg = d3.select(".parallel_plot")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        referenceParallelPlot = this;

        referenceParallelPlot.buildVisualization(referenceParallelPlot,referenceParallelPlot.dataUpdater.data)
        console.log("type update in the parallel");
    }

    highlightBrushedPoints(referenceParallelPlot, eventInfo) {

        //here you can use the following function:
        //referenceParallelPlot.dataUpdater.checkScatterplotFilter(d, eventInfo)
        //where d is a row in the data and eventInfo are the data of the event that you have already.
        //Basically it returns true if the row (sample, d or whatever) needs to be highlighed (because it is in the brush area of the scatter), false if not
        //for an example see the highlighBrushedPoints in the scatterplot, where I use the class selected
        //to change the style of the point in the brush area

        console.log("brush scatter in the parallel");

    }

    changeVisualizationColor(referenceParallelPlot) {

        //this function is called when we pass to the darkmode
        //for now ignore it but start to think how to do it

        console.log("color change in the parallel");

        //referenceParallelPlot.triggerBrushing(referenceParallelPlot, "ciao");
    }

    triggerBrushing(referenceParallelPlot){

        //this function need to be called by the brush event handler, in order to filter the database for the
        //other visualizations
        //Important: you also need to pass the data of the brush (brushData) that you need to use for selecting the rows of the dataset as range of values, categories (for this you may think to use dictionaries for efficiency) ecc

        //then you should see brushedData in the function below (checkParallelFilter)

        console.log("triggering update by parallel");

        referenceParallelPlot.dataUpdater.brushParallelUpdateData(); //don't delete this

    }
    checkParallelFilter(row){
        //console.log("checking")
        num_dimensions = dimensions.length;

        for(var i = 0;i < num_dimensions;++i){
          if(dimensions[i] == "Category" || dimensions[i] == "ContentRating"){
            if(!filters[dimensions[i]].includes(row[dimensions[i]])){
              //console.log("Not passed because of",dimensions[i],filters[dimensions[i]],row[dimensions[i]])
              return false
            }
          }
          else{
            if(row[dimensions[i]] < filters[dimensions[i]][0] || row[dimensions[i]] > filters[dimensions[i]][1]){
              //console.log("Not passed because of",dimensions[i],filters[dimensions[i]],row[dimensions[i]])
              return false
            }
          }
        }
        //console.log("passed")
        return true
        //this function will be called from the dataUpdater in the brushParallelUpdateData, where it will update the data readed from all the visualizations
        //you need to check the row and return true if the row is in the range of the brushes that you user select, false otherwise
        //this function has the same goal of the checkScatterplotFilterin the scatterplot

    }
}
