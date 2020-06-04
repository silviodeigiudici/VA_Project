class HistoContent {
    constructor(dataUpdater) {
        this.dataUpdater = dataUpdater;

        var margin = { top: 50, right: 5, bottom: 10, left: 50 }
        var height = 300  ;
        var width = 450;
        this.height = height;
        this.width = width;
        this.svg = d3.select(".histo_content")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


        var referenceHistogram = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceHistogram.startVisualization(referenceHistogram);
        });
    }

    startVisualization(referenceHistogram) {
        //to see the data(you can delete this line, it's only an example):
        var data = dataUpdater.data
        var i;
        var current;
        var occurances = {}
        var dat = []
        var categories = []
        for (i in data){
          current = data[i].ContentRating
          if (current == undefined){ //The dataset has some..imperfections
            continue
          }
          if (occurances[current] == undefined){
            occurances[current] = 1
            categories.push(current)
          }
          else{
            occurances[current] = occurances[current] + 1
          }
        }
        var max = 0
        var count = 0
        for (i in occurances){
          count = count +1
          dat[i] = []
          dat.push(occurances[i])
          if (occurances[i] > max){
            max = occurances[i]
          }
        }

        var dataObj = []
        for (let i = 0; i < count; i++) {
        dataObj[i] = {
          cat: categories[i],
          frequencies: occurances[categories[i]]
          }
        }

        var x = d3.scaleBand()
                  .range([0, referenceHistogram.width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([referenceHistogram.height, 0]);


        // get the data
        // format the data
          // Scale the range of the data in the domains
        x.domain(dataObj.map(function(d) { return d.cat; }));
        y.domain([0, d3.max(dataObj, function(d) { return d.frequencies; })]);


        // append the rectangles for the bar chart
        referenceHistogram.svg.selectAll(".bar")
          .data(dataObj)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.cat); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.frequencies); })
            .attr("height", function(d) { return referenceHistogram.height - y(d.frequencies); })
            .attr("fill", "#69b3a2");


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
        referenceHistogram.svg.append("g")
            .attr("transform", "translate(0," + referenceHistogram.height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        referenceHistogram.svg.append("g")
            .call(d3.axisLeft(y));


    }

    updateVisualization() {

    }

}
