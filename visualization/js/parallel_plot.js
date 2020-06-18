class ParallelPlot {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;
        this.x = {};
        this.y = {};
        this.c = {};
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

        this.globalG = undefined;
        this.dimensions = undefined;

        this.brush_dict = {};

        var referenceParallelPlot = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceParallelPlot.startVisualization(referenceParallelPlot,dataUpdater.data);
        });
    }

    startVisualization(referenceParallelPlot, currentData) {
        //the commented line breaks when the user deselects paid and free :(
        //var dimensions = Object.keys(currentData[0]).filter(function(d) { return d != "Current Version" && d != "highlight" && d !="Genres" && d !="Current Ver" && d != "comp0" && d!= "comp1" && d!="App" && d!="Type" && d!="LastUpdated"});
        var dimensions = [ "Category", "Rating", "Reviews", "Size", "Installs", "Price", "ContentRating", "AndroidVer" ];
        referenceParallelPlot.dimensions = dimensions;

        var data = currentData
        var i;
        var y = {}; //dictionary axies parallel
        var c = {}; //elements to put in the axies

        var filters = {}
        c["Category"] =  d3.map(data, function(d){return(d.Category)}).keys().sort()
        c["ContentRating"] =  d3.map(data, function(d){return(d.ContentRating)}).keys().sort()
        c["AndroidVer"] =  d3.map(data, function(d){return(d.AndroidVer)}).keys().sort()

        //This is used to split between categorical and numerical values since this version of d3js uses respectively scalePOint and scaleLinear
        //and we use the previously created domain lists to have their names on the axis.
        for (i in dimensions) {
          filters[dimensions[i]] = [];
          name = dimensions[i]
          if (name == "Category" || name == "ContentRating" || name == "AndroidVer"){// || name == "LastUpdated"){
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
        
        //var dragging = {};
        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
        }

        referenceParallelPlot.globalG = referenceParallelPlot.svg.append("g")
            .attr("class", "foreground"); //important, otherwise you see all black lol

        referenceParallelPlot.globalG.selectAll("path")
            .data(data, function(d) {return d.index;} )
            .enter().append("path")
            .attr("d", path).style("stroke-width", 0.5);

          // Add a group element for each dimension.
        var g = referenceParallelPlot.svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) {  return "translate(" + x(d) + ")"; }
            );
              
        
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
        var new_brush;
        g.append("g")
            .attr("class", "brush")
            .each(function(d) {
            
            if(d == 'Category' || d == "ContentRating" || d == "AndroidVer")
                new_brush = d3.brushY().extent([[-8, 0], [15,referenceParallelPlot.height]])
                    .on("brush", function(){ brushCategorical(referenceParallelPlot);})
            else
                new_brush = d3.brushY().extent([[-8, 0], [8,referenceParallelPlot.height]])
                    .on("brush", function(){ brushValues(referenceParallelPlot); })
            
            new_brush.on("start", function(){ startAction(referenceParallelPlot); })
            new_brush.on("end", function(){ endAction(referenceParallelPlot); }) //with chrome not needed
            
            y[d].brush = new_brush;

            new_brush.dimension = d;
            d3.select(this).call(new_brush);

            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

        function changePathsColor(referenceParallelPlot){
            
            referenceParallelPlot.globalG.selectAll("path").style("stroke", function(d) {
                var ret = referenceParallelPlot.checkParallelFilter(d);
                if(ret)
                    return "rgb(70, 130, 180)";
                else
                    return "#DCDCDC";
            });
        }  
        

        function brushValues(referenceParallelPlot){
            
            if(!d3.event.selection)
                return;

            var dimension = d3.event.target.dimension;
            var axis = y[dimension];
            var coordinates = d3.event.selection.map(axis.invert, axis);
            
            var limitRange = [coordinates[1].toFixed(2), coordinates[0].toFixed(2)];
            filters[dimension] = limitRange;

            changePathsColor(referenceParallelPlot);

            //referenceParallelPlot.triggerBrushing(referenceParallelPlot); //you can use it with chrome
        }

        function brushCategorical(referenceParallelPlot){

            if(!d3.event.selection)
                return;

            var dimension = d3.event.target.dimension;
            var axis = y[dimension];
            var selection = d3.event.selection;
            filters[dimension] = selection; 

            changePathsColor(referenceParallelPlot);

            //referenceParallelPlot.triggerBrushing(referenceParallelPlot); //you can use it with chrome
        }
        
        function startAction(referenceParallelPlot){
            var selection = d3.event.selection;
            if(selection[0] === selection[1]){
                var dimension = d3.event.target.dimension;
                filters[dimension] = [];
                changePathsColor(referenceParallelPlot);
            }
        
        }
        
        function endAction(referenceParallelPlot){

            referenceParallelPlot.triggerBrushing(referenceParallelPlot);

        }

        //###########################################################
        //EVENTS HANDLING, MUST BE AT THE END OF STARTVISUALIZATION
        //###########################################################


        referenceParallelPlot.dataUpdater.addListener('typeUpdateVisualization', function(e) {
            referenceParallelPlot.updateVisualization(referenceParallelPlot);
        
            /*
            var num_dims = referenceParallelPlot.dimensions;
            for (var i=0; i < num_dims; i++) {
              referenceParallelPlot.filters[referenceParallelPlot.dimensions[i]] = [];
            }*/

        });

        referenceParallelPlot.dataUpdater.addListener('brushScatterUpdateVisualization', function(e) {
            referenceParallelPlot.highlightBrushedPoints(referenceParallelPlot, e);
        });

        referenceParallelPlot.dataUpdater.addListener('darkmodeUpdateColor', function(e) {
            referenceParallelPlot.changeVisualizationColor(referenceParallelPlot);
        });

  }

    updateVisualization(referenceParallelPlot) {

        var paths = referenceParallelPlot.globalG.selectAll("path")
            .data(referenceParallelPlot.dataUpdater.data, function(d){ return d.index;} );

        paths.attr("visibility", "visible");
        paths.exit().attr("visibility", "hidden");
        
    }

    highlightBrushedPoints(referenceParallelPlot, eventInfo) {

        referenceParallelPlot.globalG.selectAll("path").style("stroke", function(d) {
            var ret = referenceParallelPlot.dataUpdater.checkScatterplotFilter(d, eventInfo.detail);
            if(ret)
                return "red";
            else
                return "rgb(70, 130, 180)";
        });

    }

    changeVisualizationColor(referenceParallelPlot) {

    }

    triggerBrushing(referenceParallelPlot){

        referenceParallelPlot.dataUpdater.brushParallelUpdateData(); //don't delete this

    }

    checkCategory(row, dimension) {
        var category = row[dimension];
        var valueRow = this.y[dimension](category);
        var filter = this.filters[dimension]; 
        if(filter.length > 0 && ( valueRow < filter[0] || valueRow > filter[1] ) )
            return false;
        else
            return true;
        }

    checkValues(row, dimension) {
        var valueRow = parseFloat(row[dimension]);
        var filter = this.filters[dimension];
        if(filter.length > 0 && ( valueRow < filter[0] || valueRow > filter[1] ) )
            return false;
        else
            return true;
        }


    checkParallelFilter(row){
        
        if(!this.checkCategory(row, "Category")) return false;
        if(!this.checkCategory(row, "ContentRating")) return false;
        if(!this.checkCategory(row, "AndroidVer")) return false;
        
        if(!this.checkValues(row, "Rating")) return false;
        if(!this.checkValues(row, "Reviews")) return false;
        if(!this.checkValues(row, "Size")) return false;
        if(!this.checkValues(row, "Installs")) return false;
        if(!this.checkValues(row, "Price")) return false;

        return true;

    }
}
