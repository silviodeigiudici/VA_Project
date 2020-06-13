class Scatterplot {
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater; 
        

        var margin_scatter = { top: -3, right: 5, bottom: 5, left: 5 }
        //var height = 400;
        //var width = 400;

        this.svg = d3.select(".scatterplot")
            .append("svg")
            .attr("width", '98%')
            .attr("height", '98%')
            .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");
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
        var width_translate = 30;
        var height_translate = 10;

        this.svg.append("g")
            .attr("transform", "translate(" + width_translate + "," + (height_translate + lenght_y) + ")")
            .call(xAxis);

        this.svg.append("g")
            .attr("transform", "translate(" + width_translate + "," + height_translate + ")")
            .call(yAxis);

        var referenceScatterplot = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceScatterplot.updateVisualization(referenceScatterplot, width_translate, height_translate);
        });

        this.dataUpdater.addListener('updateVisualization', function(e) {
            referenceScatterplot.updateVisualization(referenceScatterplot, width_translate, height_translate);
        });

        this.dataUpdater.addListener('highlightValue', function(e) {
            referenceScatterplot.highlightData(referenceScatterplot, e);
        });

    }

    updateVisualization(referenceScatterplot, width_translate, height_translate) {
        
        var circle = referenceScatterplot.svg.selectAll("circle").data(referenceScatterplot.dataUpdater.data);

        circle.exit().remove();

        circle.enter().append("circle")
            .attr("id", function(d, i) {return "c" + i.toString();} )
            .attr("r", 3)
            .style("opacity", 0.5) //.transition().duration(750);
            .merge(circle)
            .style("fill", '#2b77df')
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; });

    }

    highlightData(referenceScatterplot, eventInfo){
        
        var point = d3.select("#c" + eventInfo.detail);
        
        if( point.style("fill") === "rgb(43, 119, 223)" )
            point.style("fill", "red");
        else
            point.style("fill", "#2b77df");

    }

}


