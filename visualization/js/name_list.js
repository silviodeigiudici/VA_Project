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
            referenceNamelist.updateVisualization(referenceNamelist);
        });

        this.dataUpdater.addListener('updateVisualization', function(e) {
            referenceNamelist.updateVisualization(referenceNamelist);
        });

    }

    startVisualization(referenceNamelist){
        

        var rows = referenceNamelist.svg.selectAll("circle")
            .data(referenceNamelist.dataUpdater.data)
            .enter()
            .append("g")
            .attr("transform", "translate(50,20)");

        var distance_between_row = 15;

        rows.append("circle")
            .attr("cx", function(d) {return -40;})
            .attr("cy", function(d,i) {return distance_between_row*i - 5;}) 
            .attr("r", 5)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", "3") 
            .style("opacity", 0.5);

        rows.append("text")
            //.attr("font", "italic 3px serif") //fill: red;
            //.attr("width","500")
            //.attr("height","40")
            .attr("font-size","12px")
            .attr("x",function(d) {return -20;})
            .attr("y", function(d,i) {return distance_between_row*i;}) 
            //.attr("font-weight", "bold")
            .text(function(d,i) {return d.App;});

        referenceNamelist.svg.selectAll("circle").on("click", referenceNamelist.activateButtoms); 
        referenceNamelist.svg.selectAll("circle").on("click", function () { referenceNamelist.activateButtoms(referenceNamelist, this) }); //'this' is the buttom! not the NameList! Because this is a function called when there is the event click for the buttom
    
    }


    updateVisualization(referenceNamelist) {
        
        var rows = referenceNamelist.svg.selectAll("g")
            .data(referenceNamelist.dataUpdater.data);
        
        rows.exit().remove();

        var distance_between_row = 15;

        rows.select("circle")
            .style("fill", "white") //otherwise the color remains black if it was clicked
            .attr("cy", function(d,i) {return distance_between_row*i - 5;});

        rows.select("text")
            .attr("y", function(d,i) {return distance_between_row*i;}) 
            .text(function(d,i) {return d.App;});
        
        var g_entries = rows.enter().append("g")
            .attr("transform", "translate(50,20)");

        g_entries.append("circle")
            .attr("cy", function(d,i) {return distance_between_row*i - 5;})
            .attr("cx", function(d) {return -40;})
            .attr("r", 5)
            .style("fill", "white")
            .style("stroke", "black")
            .style("stroke-width", "3") 
            .style("opacity", 0.5);

        g_entries.append("text")
            .attr("y", function(d,i) {return distance_between_row*i;}) 
            .text(function(d,i) {return d.App;})
            .attr("font-size","12px")
            .attr("x",function(d) {return -20;});

        referenceNamelist.svg.selectAll("circle").on("click", function () { referenceNamelist.activateButtoms(referenceNamelist, this) }); //'this' is the buttom! not the NameList! Because this is a function called when there is the event click for the buttom
       
    
    }

    activateButtoms(referenceNamelist, buttomReference){
        
        var buttom = d3.select(buttomReference);         

        if ( buttom.style("fill") == "white" )
            buttom.style("fill","black");
        else
            buttom.style("fill","white");
    
    }


}


