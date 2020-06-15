class HistoCategory {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;

        var margin = { top: 50, right: 5, bottom: 10, left: 160 }
        var height = 350  ;
        var width = 330;
        this.height = height;
        this.width = width;
        this.margin = margin;
        this.svg = d3.select(".barchart")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");


        var referenceHistogramCat = this;
        this.dataUpdater.addListener('dataReady', function(e) {
            referenceHistogramCat.startVisualization(referenceHistogramCat);
        });
    }

    startVisualization(referenceHistogramCat) {
        //to see the data(you can delete this line, it's only an example):
        var data = dataUpdater.data
        var i;
        var current;
        var occurances = {}
        var dat = []
        var categories = []
        for (i in data){
          current = data[i].Category
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

      //Let's make bins for bar chart and sort it
      var dataObj = []
      for (let i = 0; i < count; i++) {
      dataObj.push({
        cat: categories[i],
        frequencies: occurances[categories[i]]
        })
      }
      dataObj.sort((a, b) => (a.frequencies < b.frequencies) ? 1 : -1)
      //console.log(dataObj)

      //Making x and y axis
      var y = d3.scaleBand()
        .range([0, referenceHistogramCat.width])
        .padding(0.1);
      var x = d3.scaleLinear()
                .range([0, referenceHistogramCat.height]);

      // Scale the range of the data in the domains
      y.domain(dataObj.map(function(d) { return d.cat; }));
      x.domain([0, d3.max(dataObj, function(d) { return d.frequencies; })]);

      // append the rectangles for the bar chart
      referenceHistogramCat.svg.selectAll(".bar")
          .data(dataObj)
          .enter().append("rect")
            .attr("class", "bar")
            .attr("width", function(d) {return x(d.frequencies); } )
            .attr("y", function(d) { return y(d.cat); })
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2");

      // drwa the x Axis
      referenceHistogramCat.svg.append("g")
          .call(d3.axisTop(x));

      //label x Axis
      referenceHistogramCat.svg.append("text")
          .attr("transform",
                "translate(" + ((referenceHistogramCat.width)/2) + " ," + "-" + referenceHistogramCat.margin.top/2 + ")")
          .style("text-anchor", "middle")
          .text("Apps");

      // draw the y Axis
      referenceHistogramCat.svg.append("g")
          .call(d3.axisLeft(y));
      //label y Axis
      referenceHistogramCat.svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - referenceHistogramCat.margin.left)
          .attr("x",0 - (referenceHistogramCat.height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Category");

}

    updateVisualization() {

    }

}
