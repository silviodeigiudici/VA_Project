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
            referenceScatterplot.startVisualization(referenceScatterplot, width_translate, height_translate);
        });

        this.dataUpdater.addListener('updateVisualization', function(e) {
            referenceScatterplot.updateVisualization(referenceScatterplot, width_translate, height_translate);
        });

    }

    startVisualization(referenceScatterplot, width_translate, height_translate){
        //if you use the following lines, don't use domain in the scaleLiner before
        //maybe d3.extent is used to find the range in the data? finding the min and max?
        //x.domain(d3.extent(dataUpdater.data, function(d) { return d.par1 + width_translate; })).nice();
        //y.domain(d3.extent(dataUpdater.data, function(d) { return d.par2 + height_translate; })).nice();
        
        //points need to be translated with respect svg as the axes did
        //x(number) covert a coordinate in the range in a web page distance

        /*
        var myCircle = referenceScatterplot.svg.selectAll("circle")
            .data(referenceScatterplot.dataUpdater.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; })
            .attr("r", 3)
            .style("fill", '#2b77df')
            .style("opacity", 0.5);
*/      

        referenceScatterplot.svg.selectAll("circle")
            .data(referenceScatterplot.dataUpdater.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; })
            .attr("r", 3)
            .style("fill", '#2b77df')
            .style("opacity", 0.5);
;
/*
        circle.attr("class","update");

        circle.enter()
            .append("circle");

        circle.attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; })
            .attr("r", 3)
            .style("fill", '#2b77df')
            .style("opacity", 0.5);
*/
    }

    updateVisualization(referenceScatterplot, width_translate, height_translate) {
        
        console.log("Start update scatterplot");
      /* 
        referenceScatterplot.svg.selectAll("circle")
            .data([])
            .exit().remove();

        referenceScatterplot.svg.selectAll("circle")
            .data(referenceScatterplot.dataUpdater.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; })
            .attr("r", 3)
            .style("fill", '#2b77df')
            .style("opacity", 0.5);
       */ 


        var circle = referenceScatterplot.svg.selectAll("circle").data(referenceScatterplot.dataUpdater.data);

        circle.exit().remove();

        circle.enter().append("circle")
            .attr("r", 3)
            .style("fill", '#2b77df')
            .style("opacity", 0.5) //.transition().duration(750);
            .merge(circle)
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; })

/*
        var circle = referenceScatterplot.svg.selectAll("circle").data(referenceScatterplot.dataUpdater.data);

        circle.enter()
            .append("circle")
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; })
            .attr("r", 3)
            .style("fill", '#2b77df')
            .style("opacity", 0.5) //.transition().duration(750);

        circle.exit().remove();
*/
        //circle.attr("class","update");
        /*
        circle.enter()
            .append("circle");

        circle.attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; })
            .attr("r", 3)
            .style("fill", '#2b77df')
            .style("opacity", 0.5);

        circle.exit()
            .attr("class", "exit")
            .transition(750)
            .ease("linear")
            .attr("cy", 0)
            .style("opacity", 0.2)
            .remove();
*/

/*
//Attach the data to the graph
        var circle = svg.selectAll("circle").data(data);

        // Update existing element
        circle.attr("class", "update");

        // Add new element
        circle.enter()
            .append("circle")
            .attr("class", "enter")
            .attr("stroke-width", 0)
            .attr("stroke", "black")
                .transition()
                .duration(750)
                .attr("y", 0)
                .style("fill-opacity", 1);

        // Apply attribute to new and updated element
        circle.attr("cx", function(d,i) {return x(d.h);})
            .attr("cy", function(d,i) {return y(d.v);})
            .attr("r", function(d,i) {return r(Math.sqrt(d.v));})
            .style("fill", function(d,i) {return color(d.v);})
            .style("opacity", function(d,i) {return o(d.v);})
            .on("click", function(d,i){window.open(d.name,'_blank');})
            .on("mouseover", function(d,i){d3.select(this).style("fill", "red").attr("stroke-width", 1);})
            .on("mouseout", function(d,i){d3.select(this).style("fill", function(d,i) {return color(d.v);}).attr("stroke-width", 0);})
            .append("title")
            .text(function(d) { return d.v+' '+ d.t+' (adjusted) - '+ d.d })
                .transition()
                .duration(750)
                .attr("y", 0)
                .style("fill-opacity", 1);

        // Remove old elements
        circle.exit()
            .attr("class", "exit")
            .transition(750)
            .ease("linear")
            .attr("cy", 0)
            .style("opacity", 0.2)
            .remove();

        // Update the Axis
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");

        svg.selectAll("g .y.axis")
            .call(yAxis)

        svg.selectAll("g .x.axis")
            .call(xAxis);
*/
    }

}


