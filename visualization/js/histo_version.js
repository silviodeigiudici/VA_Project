class HistoVersion {
    constructor(dataUpdater, colorUpdater) {
        this.dataUpdater = dataUpdater;
        this.colorUpdater = colorUpdater;
        this.categories = []

        var rect = d3.select(".histo_version").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
        this.histoWidth = rect.width;
        this.histoHeight = rect.height;

        //30, 5, 100, 60
        var margin = { top: this.histoHeight * 0.082, right: this.histoWidth * 0.0093, bottom: this.histoHeight * 0.27, left: this.histoWidth * 0.142 }
        //var margin = { top: 30, right: 5, bottom: 100, left: 60 }
        var height = this.histoHeight * 0.79; //350;
        var width = this.histoWidth * 0.781; //330;

        this.height = height;
        this.width = width;
        this.margin = margin;
        this.x = {}
        this.y = {}
        this.max = 0;
        this.svg = d3.select(".histo_version")
          .append("svg")
            .attr("width", '100%')
            .attr("height", '100%')
            //.attr("preserveAspectRatio", "xMinYMin meet")
            //.attr("viewBox", "0 0 500 400")
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
      var data = dataUpdater.brushedData;


      var x = d3.scaleBand()
                .range([0, referenceHistogramVer.width])
                .padding(0.1);
      var y = d3.scaleLinear()
                .range([referenceHistogramVer.height, 0]);
      var dataObj = referenceHistogramVer.dataObjCreation(data)
      var max = this.max;
      // Scale the range of the data in the domains
      var dom = dataObj.map(function(d) {
          if(d.cat[0] != "V"){
            return d.cat[0]+".x";
          }
          else{
            return d.cat[0]+"aries";
          } })
      dom.push("")
      console.log(dom)
      x.domain(dom)
      y.domain([0, max])
      this.x = x;
      this.y = y;


      referenceHistogramVer.buildVisualization(referenceHistogramVer,dataObj)


      referenceHistogramVer.dataUpdater.addListener('typeUpdateVisualization', function(e) {
          referenceHistogramVer.updateVisualization(referenceHistogramVer);
      });

      referenceHistogramVer.dataUpdater.addListener('brushParallelUpdateVisualization', function(e) {
          referenceHistogramVer.updateVisualization(referenceHistogramVer);
      });

      referenceHistogramVer.dataUpdater.addListener('darkmodeUpdateColor', function(e) {
          referenceHistogramVer.changeColors(referenceHistogramVer);
      });

}

    changeColors(referenceHistogramVer){


        referenceHistogramVer.svg.selectAll("text").style("fill", referenceHistogramVer.colorUpdater.getTextColor());

        referenceHistogramVer.svg.selectAll("line").style("stroke", referenceHistogramVer.colorUpdater.getAxesColor());

        referenceHistogramVer.svg.selectAll(".domain").style("stroke", referenceHistogramVer.colorUpdater.getAxesColor());

    }

    dataObjCreation(data){

      var i;
      var current;
      var occurances = {}
      var dat = []
      var flag = true;

      if(this.categories.length != 0){
        flag = false;
        var categories = this.categories;
      }
      else{
        flag = true;
        var categories = []
      }

      for (i in data){
        current = data[i].AndroidVer
        if (current == undefined){ //The dataset has some..imperfections
          continue
        }
        else if (occurances[current] == undefined){
          occurances[current] = 1
          if(flag){
            categories.push(current)
          }
        }
        else{
            occurances[current] = occurances[current] + 1
          }
        }
      if(flag){
        this.categories = categories
      }
      var max = 0
      var count = categories.length

      for (i in occurances){
        dat[i] = []
        dat.push(occurances[i])
      }

      var pr = 0
      if(flag){
        categories.sort((a, b) => (a > b) ? 1 : -1)
      }
      //Let's make bins for bar chart and sort it
      var dataObj = []
      for (let i = 0; i < count; i++) {
        if (i == 0 || categories[i][0] != categories[i-1][0]){
          pr = 0
        }
        else{
          pr = dataObj[i-1].sumPreced+dataObj[i-1].frequencies
        }
        if(occurances[categories[i]] == undefined){
          occurances[categories[i]] = 0;
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
      this.max = max;
      dataObj.sort((a, b) => (a.cat > b.cat) ? 1 : -1)
      return(dataObj)

}
    buildVisualization(referenceHistogramVer,dataObj){
      // append the rectangles for the bar chart, position them and add colors
      var x = this.x
      var y = this.y
      var z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      var versionsForColors = ["x.0","x.1","x.2","x.3","x.4","Var"]
      z.domain(versionsForColors);
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

      referenceHistogramVer.svg.append("g")
        .attr("transform", "translate(0," + referenceHistogramVer.height + ")")
        .attr("class","axisX")
        .call(d3.axisBottom(x));
      referenceHistogramVer.svg.append("text")
        .attr("transform",
              "translate(" + ((referenceHistogramVer.width)/2) + " ," +
                             (referenceHistogramVer.height + 35) + ")")
        .style("text-anchor", "middle")
        .text("Android Version");
      // add the y Axis
      referenceHistogramVer.svg.append("g")
        .attr("class","axisY")
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
    updateVisualization(referenceHistogramVer) {

      var rect = d3.select(".histo_version").node().getBoundingClientRect(); //the node() function get the DOM element represented by the selection (d3.select)
      this.histoWidth = rect.width;
      this.histoHeight = rect.height;

      var t1 = d3.transition()
          .duration(400);
      var t2 = d3.transition()
          .duration(200);

      //30, 5, 100, 60
      var margin = { top: this.histoHeight * 0.082, right: this.histoWidth * 0.0093, bottom: this.histoHeight * 0.27, left: this.histoWidth * 0.142 }
      //var margin = { top: 30, right: 5, bottom: 100, left: 60 }
      var height = this.histoHeight * 0.79; //350;
      var width = this.histoWidth * 0.781; //330;
      var t1 = d3.transition()
          .duration(400);
      this.height = height;
      this.width = width;
      this.margin = margin;

      var dataObj = referenceHistogramVer.dataObjCreation(referenceHistogramVer.dataUpdater.brushedData);

      var z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
      var versionsForColors = ["x.0","x.1","x.2","x.3","x.4","Var"]
      z.domain(versionsForColors);

      var x = d3.scaleBand()
                .range([0, referenceHistogramVer.width])
                .padding(0.1);
      var y = d3.scaleLinear()
                .range([referenceHistogramVer.height, 0]);
      var max = this.max;
      // Scale the range of the data in the domains
      var dom = dataObj.map(function(d) {
          if(d.cat[0] != "V"){
            return d.cat[0]+".x";
          }
          else{
            return d.cat[0]+"aries";
          } })
      dom.push("")
      console.log(dom)
      x.domain(dom)
      y.domain([0, max])

      referenceHistogramVer.svg.selectAll(".bar")
        .data(dataObj)
        .transition(t1)

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

      referenceHistogramVer.svg.select(".axisY")
          .transition(t1)
          .call(d3.axisLeft(y));

      referenceHistogramVer.changeColors(referenceHistogramVer);

    }

}
