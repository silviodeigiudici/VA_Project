function updateVisualization() {

}

var margin_scatter = { top: -3, right: 5, bottom: 5, left: 5 }
//var height = 400;
//var width = 400;

var svg = d3.select(".scatterplot")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr("transform", "translate(" + margin_scatter.left + "," + margin_scatter.top + ")");
    /*
    .attr("width", width)
    .attr("height", height);
*/

var lenght_x = 350;
var x = d3.scaleLinear()
    .range([0, lenght_x]);

var lenght_y = 340;
var y = d3.scaleLinear()
    .range([lenght_y, 0]);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);

//translation of the axes with respect the svg
var width_translate = 30;
var height_translate = 10;

svg.append("g")
    .attr("transform", "translate(" + width_translate + "," + (height_translate + lenght_y) + ")")
    .call(xAxis);

svg.append("g")
    .attr("transform", "translate(" + width_translate + "," + height_translate + ")")
    .call(yAxis);




dataUpdater.addListener('dataReady', function(e) {
    console.log(dataUpdater.data);
    //get data
    
    //prepare visualization
      
    x.domain(d3.extent(dataUpdater.data, function(d) { return d.par1 + width_translate; })).nice();
    y.domain(d3.extent(dataUpdater.data, function(d) { return d.par2 + height_translate; })).nice();
    
    var myCircle = svg.selectAll("circle")
        .data(dataUpdater.data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.par1 + 5) + width_translate; })
        .attr("cy", function (d) { return y(d.par2 + 5) + height_translate; })
        .attr("r", 3)
        .style("fill", '#2b77df')
        .style("opacity", 0.5);



    //regiter listeners (update, brushing, filtering ecc) 
});
