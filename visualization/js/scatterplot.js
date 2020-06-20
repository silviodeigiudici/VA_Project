class Scatterplot {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater; 
        this.colorUpdater = colorUpdater;

        var rect = d3.select(".scatterplot").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
        this.scatterplotWidth = rect.width;
        this.scatterplotHeight = rect.height;

        this.brush = undefined;
        this.brushData = null;
        this.checkBrushClick = undefined;

        var margin_scatter = { top: -3, right: 5, bottom: 5, left: 5 }
        //var height = 400;
        //var width = 400;

        this.svg = d3.select(".scatterplot")
            .append("svg")
            .attr("width", '98%')
            .attr("height", '98%')
            .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");

        this.globalG = this.svg.append("g");
            /*
            .attr("width", width)
            .attr("height", height);
        */
        
        this.list_range = [0.0, 3.0, 3.5, 3.8, 4.3, 4.5, 5.0];

        this.labels = [];

        var list_len = this.list_range.length;
        for(var i=1; i < list_len; i++){
            var i1 = this.list_range[i-1];
            var i2 = this.list_range[i];
            this.labels.push("Rating (" + i1.toFixed(1) + "," + i2.toFixed(1) + ")");
        }

        /*
        this.colorDict = [
                        '#2b77df',
                        "#6d8181",
                        "#F0F032",
                        "black",
                        "#C32C01",
                        "#A1DBFF",
                        "#FFFFFF",
                        "#FFA765"
        ];
        */
        var labes_x = this.scatterplotWidth * 0.9;
        var labes_y = this.scatterplotHeight * 0.0235;

        var referenceScatterplot = this;
        
        var colorDict = referenceScatterplot.colorUpdater.getScatterplotPointsColors();

        this.legend = this.svg.selectAll('legend')
            .data(this.labels) //, function(d, i) {return i;})
            .enter().append('g')
            .attr('class', 'legend')
            .attr('transform', function (d, i) { return 'translate(20,' + i * 20 + ')'; });

        this.legend.append('rect')
          .attr('x', labes_x)
          .attr('y', labes_y)
          .attr('width', 15)
          .attr('height', 15)
          .attr('class', 'legend_rect')
          .style('fill', function (d, i) { return colorDict[i] });

        this.legend.append('text')
          .attr('x', labes_x - 2)
          .attr('y', labes_y + 9)
          .attr('dy', '.25em')
          .style('text-anchor', 'end')
          .style("fill", "black")
          .text(function (d, i) { return referenceScatterplot.labels[i]; });
        
        

        //var referenceScatterplot = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceScatterplot.startVisualization(referenceScatterplot);
        });

    }

    checkScatterplotFilter(row) {
        
        if(this.brushData === null) return false;

        var x0 = this.brushData[0][0],
            x1 = this.brushData[1][0],
            y0 = this.brushData[0][1],
            y1 = this.brushData[1][1];

        var cx = this.x(parseFloat(row.comp0)) + this.width_translate;
        var cy = this.y(parseFloat(row.comp1)) + this.height_translate;
        
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;

    }


    startBrushing(referenceScatterplot, brushData){

        referenceScatterplot.checkBrushClick = true;
        
        /*
        if(brushData[0][0] === brushData[1][0] && brushData[0][1] === brushData[1][1]){
            referenceScatterplot.brushData = null;
            referenceScatterplot.globalG.selectAll("circle").data(referenceScatterplot.dataUpdater.brushedData, function(d) {return d.index;} ).classed("selected", function(d) {
                return referenceScatterplot.dataUpdater.checkScatterplotFilter(d);
            });
        }
        */

    }

    highlightBrushedPoints(referenceScatterplot, brushData){

        referenceScatterplot.checkBrushClick = false;

        referenceScatterplot.brushData = brushData; 

        referenceScatterplot.selectBrushedPoints(referenceScatterplot);

    }

    selectBrushedPoints(referenceScatterplot){

        referenceScatterplot.globalG.selectAll("circle").data(referenceScatterplot.dataUpdater.brushedData, function(d) {return d.index;} ).classed("selected", function(d) {
            return referenceScatterplot.dataUpdater.checkScatterplotFilter(d);
        });

    }

    triggerBrushing(referenceScatterplot, brushData){

        if(referenceScatterplot.checkBrushClick){

            referenceScatterplot.brushData = null;
            referenceScatterplot.selectBrushedPoints(referenceScatterplot);

        }

        //referenceScatterplot.brushData = brushData; //not need, it's already done in highlightBrushedPoints

        referenceScatterplot.dataUpdater.brushScatterUpdateData();

    }

    getColorByRow(row, colorDict){
        var coord = parseFloat(row.Rating);

        var list_len = this.list_range.length;
        for(var i=1; i < list_len; i++){
            var i1 = this.list_range[i-1];
            var i2 = this.list_range[i];
            if( coord >= i1 && coord <= i2 )
                return colorDict[i - 1];
        }
    }

    updateColorMode(referenceScatterplot){

        var circle = referenceScatterplot.globalG.selectAll("circle").data(referenceScatterplot.dataUpdater.originalData, function(d) {return d.index;} );

        var colorDict = referenceScatterplot.colorUpdater.getScatterplotPointsColors();

        circle.style("fill", function(d) { return referenceScatterplot.getColorByRow(d, colorDict); })

        this.legend.select('rect').style('fill', function (d, i) { return colorDict[i] });
        
    }

    updateVisualization(referenceScatterplot) {
        
        //referenceScatterplot.svg.call(referenceScatterplot.brush.move, null)
        
        var circle = referenceScatterplot.globalG.selectAll("circle").data(referenceScatterplot.dataUpdater.brushedData, function(d) {return d.index;} );

        
        circle.attr("visibility", "visible");

        circle.exit().attr("visibility", "hidden");

    }

    updateTypeVisualization(referenceScatterplot){

        referenceScatterplot.updateVisualization(referenceScatterplot);

        referenceScatterplot.selectBrushedPoints(referenceScatterplot);

    }

    startVisualization(referenceScatterplot) {

        var median0 = d3.median(referenceScatterplot.dataUpdater.brushedData, function(d) {return parseFloat(d.comp0);});
        var median1 = d3.median(referenceScatterplot.dataUpdater.brushedData, function(d) {return parseFloat(d.comp1);});
        var variance0 = d3.variance(referenceScatterplot.dataUpdater.brushedData, function(d) {return parseFloat(d.comp0);});
        var variance1 = d3.variance(referenceScatterplot.dataUpdater.brushedData, function(d) {return parseFloat(d.comp1);});

        var min0 = median0 - (variance0 + 1.5);
        var max0 = median0 + (variance0 + 2.5);
        var min1 = median1 - (variance1);
        var max1 = median1 + (variance1 + 2);

        var lenght_x = referenceScatterplot.scatterplotWidth * 0.88;
        this.x = d3.scaleLinear()
            //.domain([min0, max0])
            .domain([min0, max0])
            .range([0, lenght_x]);

        var lenght_y = referenceScatterplot.scatterplotHeight * 0.91;
        this.y = d3.scaleLinear()
            //.domain([min1, max1])
            .domain([min1, max1])
            .range([lenght_y, 0]);

        var xAxis = d3.axisBottom(this.x);
        var yAxis = d3.axisLeft(this.y);

        //translation of the axes with respect the svg
        //var width_translate = 30;
        this.width_translate = referenceScatterplot.scatterplotWidth * 0.05;
        //var height_translate = 10;
        this.height_translate = referenceScatterplot.scatterplotHeight * 0.0235;

        this.svg.append("g")
            .attr("transform", "translate(" + this.width_translate + "," + (this.height_translate + lenght_y) + ")")
            .call(xAxis);

        this.svg.append("g")
            .attr("transform", "translate(" + this.width_translate + "," + this.height_translate + ")")
            .call(yAxis);

        //referenceScatterplot.buildVisualization(referenceScatterplot);
        var circle = referenceScatterplot.globalG.selectAll("circle").data(referenceScatterplot.dataUpdater.originalData, function(d) {return d.index;} );

        var colorDict = referenceScatterplot.colorUpdater.getScatterplotPointsColors();

        circle.enter().append("circle")
            .attr("id", function(d, i) { return "c" + i.toString();} )
            .attr("r", 3)
            .style("opacity", 0.5) //.transition().duration(750);
            //.merge(circle)
            //.transition().duration(600)
            .style("fill", function(d) { return referenceScatterplot.getColorByRow(d, colorDict); })
            //.style("fill", function(d, i) {return (d.highlight === "0") ? "#2b77df" : "red";} )
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + referenceScatterplot.width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + referenceScatterplot.height_translate; });
        
        //after building the visualization, let's enable the interactions registering to the events
        
        referenceScatterplot.brush = d3.brush()  
            .extent( [ [0,0], [referenceScatterplot.scatterplotWidth,referenceScatterplot.scatterplotHeight] ] ) 
            .on("end", function(e) { //you can write .on("start brush end", ..-) to get a notification of the event when you start brushing, when you continue to brush, and when you stop the brush (even if you simple translate the brush rectangular)
                referenceScatterplot.triggerBrushing(referenceScatterplot, d3.event.selection);
            })
            .on("brush", function(e){
                referenceScatterplot.highlightBrushedPoints(referenceScatterplot, d3.event.selection);
            })
            .on("start", function(e){
                referenceScatterplot.startBrushing(referenceScatterplot, d3.event.selection);
            });

        referenceScatterplot.svg.call(referenceScatterplot.brush); //note: call to svg, not the globalG

        //same for these events, once visualization is completed, let's enable them
        referenceScatterplot.dataUpdater.addListener('typeUpdateVisualization', function(e) {
            referenceScatterplot.updateTypeVisualization(referenceScatterplot);
        });

        referenceScatterplot.dataUpdater.addListener('darkmodeUpdateColor', function(e) {
            referenceScatterplot.updateColorMode(referenceScatterplot); //you can't use this now, need a now one
        });

        referenceScatterplot.dataUpdater.addListener('brushParallelUpdateVisualization', function(e) {
            referenceScatterplot.updateVisualization(referenceScatterplot);
        });

    }

}


