var svg = d3.select("body")
    .append("svg")
    .attr("width","480")
    .attr("height","270")
    .style('display', 'block');
margin = {top: 60, right: 55, bottom: 30, left: 45};
width = +svg.attr("width") - margin.left - margin.right;
height = +svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var tvhours=[
    {"year": 0, "value": 5},
    {"year": 1, "value": 24},
    {"year": 2, "value": 28},
    {"year": 3, "value": 16},
    {"year": 4, "value": 11},
    {"year": 5, "value": 6},
    {"year": 6, "value": 4},
    {"year": 7, "value": 1},
    {"year": 8, "value": 2},
    {"year": 9, "value": 0},
    {"year": 10, "value": 1},
    {"year": 11, "value": 0},
    {"year": 12, "value": 1},
    {"year": 13, "value": 0},
    {"year": 14, "value": 0},
    {"year": 15, "value": 0},
    {"year": 16, "value": 0},

];
var dataSet=tvhours;
var rectPadding = width/(2*dataSet.length);

var formatNumber = d3.format(",d");

var yMax = Math.round(d3.max(dataSet, function(d){return d.value}))

var x = d3.scaleLinear()
    .domain([d3.min(dataSet, function (d) {
        return d.year;
    }),d3.max(dataSet, function (d) {
        return d.year;
    })])
    .range([rectPadding, width-rectPadding]);

var y = d3.scaleLinear()
    .domain([0, yMax])
    .range([height, 0]);

var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .ticks(dataSet.length);

var yAxis = d3.axisRight(y)
    .tickSize(width)
    .ticks(yMax/5)
    .tickFormat(function(d) {
        var s = formatNumber(d);
        return s;
    });

g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .selectAll("text")
    .attr("y", 8)
    .attr('class','bree')
    .style("text-anchor", "center")
    .style("font-size","11px");

g.append("g")
    .call(customYAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", -6)
    .attr('class','bree')
    .style("text-anchor", "end")
    .style("font-size","10px");


// tip = d3.tip()
//     .text(function (d) {
//         return d.value;
//     });
//
// g.call(tip)

g.selectAll("rect")
    .data(dataSet)
    .enter()
    .append('rect')
    .attr("x",function(d,i){
        return (i+0.5)*rectPadding+(width/dataSet.length-rectPadding)*i;
    })
    .attr("y",function(d){
        return height-height*(d.value/yMax);
    })
    .attr("width", width/dataSet.length-rectPadding)
    .attr("height",function(d){
        return height*(d.value/yMax);
    })
    .attr("fill","red")
    .on('mouseover', function (d) {
        d3.select(this).attr('fill','#ff8484');
        var xPos = +d3.select(this).attr("x");
        var yPos = +d3.select(this).attr('y');
        var wid = +d3.select(this).attr("width");
        d3.select(this).attr("x", xPos - 4).attr("width", wid + 8);
        d3.select(this.parentNode).append('text')
            .attr('class','tip')
            .attr('text-anchor','middle')
            .style('font-size',12)
            .attr('fill','#600404')
            .attr('x',xPos+rectPadding/4)
            .attr('y',yPos-5)
            .text(d.value);
    })
    .on('mouseout', function () {
        d3.select(this).attr('fill','red');
        var xPos = +d3.select(this).attr("x")
        var wid = +d3.select(this).attr("width");
        d3.select(this).attr("x", xPos + 4).attr("width", wid - 8);
        d3.select('.tip').remove();


    })

function customYAxis(g) {
    g.call(yAxis);
    g.select(".domain").remove();
}

svg.append("svg:image")
    .attr("x","360")
    .attr("y","30")
    .attr("width","75")
    .attr("xlink:href", "img/image4.jpg")
    .on('mouseover', function () {
        d3.select(this).attr('width',90);
    })
    .on('mouseout', function () {
        d3.select(this).attr('width',75);
    })

svg.append("text")
    .attr("x",30)
    .attr("y",30)
    .text("Happinese depend on tvhours per week")
    .style("font-size","20px");

svg.append("text")
    .attr("x",30)
    .attr("y",45)
    .attr('class','bree')
    .text("in persentage")
    .style("font-size","12px");