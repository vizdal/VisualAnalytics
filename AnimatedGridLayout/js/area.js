function createAreatChart(elem,country){
var margin = {top: 20, right: 20, bottom: 20, left: 30},
    width = 250 - margin.left - margin.right,
    height = 120 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select(elem)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("data/Final-World-Happiness.csv").then(function(data){
  // When reading the csv, I must format variables:
  // Now I can use this dataset:
    data = data.filter(d => { return d['Country name'] == country});
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.Year; }))
      .range([ 0, width ]);
    xAxis = svg.append("g");
      xAxis.attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(5).tickPadding(6).tickSize(3).tickFormat(d3.format("d"))).selectAll("text").style('font-size','0.7em').attr("fill","#fff");
    xAxis.selectAll("line").attr("fill","#fff").attr("stroke","#fff")
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d['Positive affect']; })])
      .range([ height, 0 ]);

    var yAxis = svg.append("g");
    yAxis.call(d3.axisLeft(y).ticks(4).tickPadding(6).tickSize(3)).selectAll('text').style('font-size','0.7em').attr("fill","#fff");
    yAxis.selectAll("line").attr("fill","#fff").attr("stroke","#fff")
    // Add the area
    svg.append("path")
      .datum(data)
      .attr("fill", "#F22248")
      .attr("stroke", "#F2F2F2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(function(d) { return x(d.Year) })
        .y0(y(0))
        .y1(function(d) { return y(d['Positive affect']) })
        )
});
}
//https://codepen.io/idan/pen/xejuD
//https://color.adobe.com/explore?page=12
//https://bl.ocks.org/d3noob/629790fc15cc1afba0253f29a4d246e7
//https://www.d3-graph-gallery.com/graph/area_basic.html
