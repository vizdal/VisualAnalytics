var svg_width=500;
var svg_height=200;
var bar_padding=5;

var dataset=[30,20,10,40,45,25,15,35,18];
var year=[1992,1994,1996,1998,2000,2002,2004,2006,2008]
// dataset[0]
var svg=d3.select("body")
        .append("svg")
        .attr("width",svg_width)
        .attr("height",svg_height);

svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x",function (d,i) {
        return i*(svg_width/dataset.length);

    })
    .attr("y",function (d) {
        return svg_height-(d*4);

    })
    .attr("width",svg_width/dataset.length-bar_padding)
    .attr("height",function (d) {
         return d*4;

    })
    .attr("fill",function (d) {
        return "rgb("+d*5+",0,0)";

    })
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function (d) {
        return d;
    })
    .attr("text-anchor","middle")
    .attr("x",function (d,i) {
        return i*(svg_width/dataset.length)+(svg_width/dataset.length-bar_padding)/2;
    })
    .attr("y",function (d) {
        return svg_height-(d*4)+20;

    })
    .attr("font-family","sans-serif")
    .attr("font-size","20px")
    .attr("fill","white")

var x = d3.scaleTime()
    .domain([d3.min(d3.extent(year, function (d) { return new Date(parseInt(d),0); }))
        ,d3.max(d3.extent(year, function (d) { return new Date(parseInt(d),0); }))])
    .range([rectPadding, width-rectPadding]);

var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .tickFormat(d3.timeFormat("%Y"));

g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 8)
    .attr('class','bree')
    .style("text-anchor", "center")
    .style("font-size","11px");