class HistoVersion {
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater;

        var margin = { top: 50, right: 5, bottom: 10, left: 50 }
        var height = 300  ;
        var width = 450;
        this.height = height;
        this.width = width;
        this.svg = d3.select(".histo_version")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


        var referenceHistogramVer = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceHistogramVer.startVisualization(referenceHistogramVer);
        });
    }

    startVisualization(referenceHistogramVer) {
        //to see the data(you can delete this line, it's only an example):
        var data = dataUpdater.data
        var i;
        var current;
        var occurances = {}
        var dat = []
        var categories = []
        for (i in data){
          current = data[i].AndroidVer
          if (current == undefined){ //The dataset has some..imperfections
            continue
          }
          else if (occurances[current] == undefined){
            occurances[current] = 1
            categories.push(current)
          }
          else{
            if(current == "Varies with device"){
              occurances[current] = occurances[current] + 1
            }
            else{
              occurances[current] = occurances[current] + 1
            }
          }
        }
      var max = 0
      var count = 0
      for (i in occurances){
        count = count +1
        dat[i] = []
        dat.push(occurances[i])
      }

      var pr = 0
      categories.sort((a, b) => (a > b) ? 1 : -1)
      //Let's make bins for bar chart and sort it
      var dataObj = []
      for (let i = 0; i < count; i++) {
        if (i == 0 || categories[i][0] != categories[i-1][0]){
          pr = 0
        }
        else{
          pr = dataObj[i-1].sumPreced+dataObj[i-1].frequencies
        }
        dataObj.push({
          cat: categories[i],
          frequencies: occurances[categories[i]],
          sumPreced: pr
          })
        if(occurances[categories[i]] + pr > max){
          max = occurances[categories[i]] + pr
        }
      }
      dataObj.sort((a, b) => (a.cat > b.cat) ? 1 : -1)

      var x = d3.scaleBand()
                .range([0, referenceHistogramVer.width])
                .padding(0.1);
      var y = d3.scaleLinear()
                .range([referenceHistogramVer.height, 0]);

      // Scale the range of the data in the domains
      x.domain(dataObj.map(function(d) {
          if(d.cat[0] != "V"){
            return d.cat[0]+".x";
          }
          else{
            return d.cat[0]+"aries";
          } }));
      y.domain([0, max])
      var z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


      var versionsForColors = ["x.0","x.1","x.2","x.3","x.4","Var"]
      z.domain(versionsForColors);

      // append the rectangles for the bar chart, position them and add colors
      referenceHistogramVer.svg.selectAll(".bar")
        .data(dataObj)
        .enter().append("rect")

          .attr("class", "bar")
          .attr("x", function(d) {
            if(d.cat[0] != "V"){
              return x(d.cat[0]+".x")
            }
            else{
              return x(d.cat[0]+"aries")
          }})
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.sumPreced +d.frequencies); })
          .attr("height", function(d) { return  referenceHistogramVer.height - y(d.frequencies); })
          .attr("fill", function(d) {
            if(d.cat[2] == "r"){
              return z("Var")
            }
            else{
              return z("x."+d.cat[2]);
            }
          });

    /* #Label over bars, need fixing
    referenceHistogram.svg.selectAll(".bar")
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", function(d) { return y(d.frequencies)+500; })
      .attr("x", function(d) { return x(d.cat); })
      .text(function(d) { return d.frequencies; })
      .style("fill", "black")
*/
    // add the x Axis
    referenceHistogramVer.svg.append("g")
        .attr("transform", "translate(0," + referenceHistogramVer.height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    referenceHistogramVer.svg.append("g")
        .call(d3.axisLeft(y));

    //Append a legend and populate it
    var legend = referenceHistogramVer.svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(versionsForColors)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", referenceHistogramVer.width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", referenceHistogramVer.width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });

}

    updateVisualization() {

    }

}
