class Scatterplot {
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater; 

        this.brush = undefined;

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

        var lenght_x = 525;
        this.x = d3.scaleLinear()
            .domain([-5, 4])
            .range([0, lenght_x]);

        var lenght_y = 400;
        this.y = d3.scaleLinear()
            .domain([-5, 5])
            .range([lenght_y, 0]);

        var xAxis = d3.axisBottom(this.x);
        var yAxis = d3.axisLeft(this.y);

        //translation of the axes with respect the svg
        //var width_translate = 30;
        this.width_translate = 30;
        //var height_translate = 10;
        this.height_translate = 10;

        this.svg.append("g")
            .attr("transform", "translate(" + this.width_translate + "," + (this.height_translate + lenght_y) + ")")
            .call(xAxis);

        this.svg.append("g")
            .attr("transform", "translate(" + this.width_translate + "," + this.height_translate + ")")
            .call(yAxis);

        var referenceScatterplot = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceScatterplot.startVisualization(referenceScatterplot);
        });

    }

    buildVisualization(referenceScatterplot, width_translate, height_translate){

        var circle = referenceScatterplot.globalG.selectAll("circle").data(referenceScatterplot.dataUpdater.brushedData);

        circle.exit().remove();

        circle.enter().append("circle")
            .attr("id", function(d, i) {return "c" + i.toString();} )
            .attr("r", 3)
            .style("opacity", 0.5) //.transition().duration(750);
            .merge(circle)
            .style("fill", '#2b77df')
            //.style("fill", function(d, i) {return (d.highlight === "0") ? "#2b77df" : "red";} )
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + referenceScatterplot.width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + referenceScatterplot.height_translate; });
    }

    checkScatterplotFilter(row, eventInfo) {
        
        var brushData = eventInfo.detail;
        
        if(brushData === null) return false;

        var x0 = brushData[0][0],
            x1 = brushData[1][0],
            y0 = brushData[0][1],
            y1 = brushData[1][1];

        var cx = this.x(parseFloat(row.comp0)) + this.width_translate;
        var cy = this.y(parseFloat(row.comp1)) + this.height_translate;
        
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;

    }

    highlightBrushedPoints(referenceScatterplot, eventInfo){
        
        referenceScatterplot.globalG.selectAll("circle").classed("selected", function(d) {
            return referenceScatterplot.dataUpdater.checkScatterplotFilter(d, eventInfo);
        }); 

    }

    triggerBrushing(referenceScatterplot, brushData){
        
        referenceScatterplot.dataUpdater.brushScatterUpdateData(brushData);

    }

    updateVisualization(referenceScatterplot) {
        
        referenceScatterplot.svg.call(referenceScatterplot.brush.move, null)
        
        referenceScatterplot.buildVisualization(referenceScatterplot);

    }

    startVisualization(referenceScatterplot) {

        referenceScatterplot.buildVisualization(referenceScatterplot);
        
        //after building the visualization, let's enable the interactions registering to the events
        var rect = d3.select(".scatterplot").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
        
        referenceScatterplot.brush = d3.brush()  
            .extent( [ [0,0], [rect.width,rect.height] ] ) 
            .on("start brush", function(e) { //you can write .on("start brush end", ..-) to get a notification of the event when you start brushing, when you continue to brush, and when you stop the brush (even if you simple translate the brush rectangular)
                referenceScatterplot.triggerBrushing(referenceScatterplot, d3.event.selection);
            });

        referenceScatterplot.svg.call(referenceScatterplot.brush); //note: call to svg, not the globalG

        //same for these events, once visualization is completed, let's enable them
        referenceScatterplot.dataUpdater.addListener('typeUpdateVisualization', function(e) {
            referenceScatterplot.updateVisualization(referenceScatterplot);
        });

        referenceScatterplot.dataUpdater.addListener('brushScatterUpdateVisualization', function(e) {
            referenceScatterplot.highlightBrushedPoints(referenceScatterplot, e);
        });

    }

}


