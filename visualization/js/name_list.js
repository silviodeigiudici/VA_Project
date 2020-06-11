class NameList{
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater; 
        
        var margin = { top: 0, right: 0, bottom: 0, left: 0 }
        
        this.svg = d3.select(".name_list")
            .append("svg")
            .attr("width", '98%')
            .attr("height", '98%')
            .attr("overflow","scroll")
            //.attr("display","block")
            .attr("width","200%")
            .attr("height", "23000%") //(5421 / 23)*100
            //.attr("viewBox", "0,0,500,1000")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var referenceNamelist = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceNamelist.startVisualization(referenceNamelist);
        });

        this.dataUpdater.addListener('updateVisualization', function(e) {
            referenceNamelist.updateVisualization(referenceNamelist);
        });

    }

    startVisualization(referenceNamelist){
        

        var row = referenceNamelist.svg.selectAll("circle")
            .data(referenceNamelist.dataUpdater.data)
            .enter()
            .append("g")
            .attr("transform", "translate(50,20)");

        var distance_between_row = 15;

        row.append("circle")
            .attr("cx",-40)
            .attr("cy", function(d,i) {return distance_between_row*i - 5;}) 
            .attr("r", 5)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", "3") 
            .style("opacity", 0.5);

        row.append("text")
            //.attr("font", "italic 3px serif") //fill: red;
            //.attr("width","500")
            //.attr("height","40")
            .attr("font-size","12px")
            .attr("x",-20)
            .attr("y", function(d,i) {return distance_between_row*i;}) 
            //.attr("font-weight", "bold")
            .text(function(d,i) {return d.App});

        /*
        referenceNamelist.svg.append("text")
            .attr("cx",50)
            .attr("cy",50)
            .attr("font", "bold 30px sans-serif")
            .attr("text-anchor", "end")
            .attr("font-weight", "bold")
            .text("Robe");
*/
/*
        referenceNamelist.svg.selectAll("circle")
            .data(referenceNamelist.dataUpdater.data)
            .enter()
            .append("circle")
            //.attr("cx", function (d,i) { return i;})
            .attr("cx", 50)
            //.attr("cy", function (d) { return 10;})
            .attr("cy", function(d,i) {return 9*i;}) 
            .attr("r", 5)
            .style("fill", "none")
            .style("stroke", "black")
            .style("stroke-width", "3") 
            .style("opacity", 0.5);
  */
  }

    updateVisualization(referenceScatterplot, width_translate, height_translate) {
        

    }

}


