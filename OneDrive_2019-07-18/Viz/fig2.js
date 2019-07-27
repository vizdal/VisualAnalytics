var svg_width=500
var svg_height=200;

var dataset =[1,2,3,4];
var svg=d3.select("body")
          .append("svg")
    .attr("width",svg_width)
    .attr("height",svg_height);
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect)
        .attr("x",function(d,i))

