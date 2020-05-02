class Scatterplot {
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater; 
        

        var margin_scatter = { top: -3, right: 5, bottom: 5, left: 5 }
        //var height = 400;
        //var width = 400;

        this.svg = d3.select(".scatterplot")
            .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");
            /*
            .attr("width", width)
            .attr("height", height);
        */

        var lenght_x = 350;
        this.x = d3.scaleLinear()
            .domain([-5, 5])
            .range([0, lenght_x]);

        var lenght_y = 340;
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
        var myCircle = referenceScatterplot.svg.selectAll("circle")
            .data(referenceScatterplot.dataUpdater.data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return referenceScatterplot.x(parseFloat(d.comp0)) + width_translate; })
            .attr("cy", function (d) { return referenceScatterplot.y(parseFloat(d.comp1)) + height_translate; })
            .attr("r", 3)
            .style("fill", '#2b77df')
            .style("opacity", 0.5);

    }

    updateVisualization(referenceScatterplot, width_translate, height_translate) {
        
        console.log("Start update scatterplot");
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

    }

}


