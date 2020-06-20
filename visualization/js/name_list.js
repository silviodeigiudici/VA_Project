class NameList{
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater; 
        this.colorUpdater = colorUpdater;
        
        var margin = { top: 0, right: 0, bottom: 0, left: 0 }
        
        this.svg = d3.select(".name_list")
            .append("svg")
            .attr("width", '98%')
            .attr("height", '98%')
            .attr("overflow","scroll")
            //.attr("display","block")
            .attr("width","200%")
            //.attr("height", "23000%") //(5421 / 23)*100
            //.attr("viewBox", "0,0,500,1000")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var referenceNamelist = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceNamelist.startVisualization(referenceNamelist);
        });

    }


    buildVisualization(referenceNamelist) {
        
        //Preparing the data
        var dict = {};

        referenceNamelist.dataUpdater.brushedData.forEach( function(row, index) {
            
            if (dict[row.Installs] != undefined )
                dict[row.Installs].push(row.App);
            else
                dict[row.Installs] = [row.App];

        });
        
        var moreDownloaded = [];
        var num = 20;
        var keys = Object.keys(dict).sort( function(a,b) { return parseInt(b, 10) - parseInt(a,10) } );
        var numInstallsCat = keys.length;

        var actualList = undefined;
        var i = 0;
        var j = 0;
        var k = 0;

        while ( i < num && j < numInstallsCat){

            actualList = dict[keys[j]];
            
            if (k < actualList.length){ 
                moreDownloaded.push(actualList[k]);
                k++;
                i++;
            }
            else{
                k=0;
                j++;
            }

        }
        
        //##########################################
        //Draw the app names
        var rows = referenceNamelist.svg.selectAll("g")
            .data(moreDownloaded);
        
        rows.exit().remove();
            //.transition().duration(600).attr("transform", "translate(50,0)");

        var distance_between_row = 15;

        var g_entries = rows.enter().append("g")
            .attr("transform", "translate(50,20)");

        g_entries.append("circle")
            .attr("cx", function(d) {return -40;})
            .attr("r", 5)
            //.style("stroke", "black")
            .style("fill", "black") 
            //.style("stroke-width", "3") 
            .style("opacity", 0.5);

        g_entries.append("text")
            .attr("font-size","12px")
            .attr("x",function(d) {return -30;});

        var all_g = g_entries.merge(rows);

        all_g.select("circle")
            //.transition().duration(600)
            .attr("cy", function(d,i) {return distance_between_row*i - 5;});

        all_g.select("text")
            //.transition().duration(600)
            .attr("y", function(d,i) {return distance_between_row*i;}) 
            .text(function(d,i) {return d;});

    }

    updateVisualization(referenceNamelist){

        referenceNamelist.buildVisualization(referenceNamelist);

    }

    startVisualization(referenceNamelist){

        referenceNamelist.buildVisualization(referenceNamelist);
        
        this.dataUpdater.addListener('typeUpdateVisualization', function(e) {
            referenceNamelist.updateVisualization(referenceNamelist);
        });

        this.dataUpdater.addListener('brushParallelUpdateVisualization', function(e) {
            referenceNamelist.updateVisualization(referenceNamelist);
        });

    }

}


