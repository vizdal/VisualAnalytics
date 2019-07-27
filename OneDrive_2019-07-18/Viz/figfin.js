var svg = d3.select("body")
    .append("svg")
    .attr("width","480")
    .attr("height","270")
    .style('display', 'block');
margin = {top: 60, right: 55, bottom: 30, left: 45};
width = +svg.attr("width") - margin.left - margin.right;
height = +svg.attr("height") - margin.top - margin.bottom;
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var female = [
    {"year": 1994, "very happy": 0.28, "happy": 0.59,"bot happy": 0.13},
    {"year": 1996, "very happy": 0.29, "happy": 0.58,"bot happy": 0.13},
    {"year": 1998, "very happy": 0.33, "happy": 0.54,"bot happy": 0.13},
    {"year": 2000, "very happy": 0.32, "happy": 0.57,"bot happy": 0.10},
    {"year": 2002, "very happy": 0.28, "happy": 0.56,"bot happy": 0.15},
    {"year": 2004, "very happy": 0.33, "happy": 0.55,"bot happy": 0.12},
    {"year": 2006, "very happy": 0.31, "happy": 0.55,"bot happy": 0.13},
]
var female1 = [
    {"year": 1994, "value": 28},
    {"year": 1996, "value": 29},
    {"year": 1998, "value": 33},
    {"year": 2000, "value": 32},
    {"year": 2002, "value": 28},
    {"year": 2004, "value": 33},
    {"year": 2006, "value": 31},
]

var male = [
    {"year": 1994, "very happy": 0.30, "happy": 0.59,"bot happy": 0.11},
    {"year": 1996, "very happy": 0.32, "happy": 0.57,"bot happy": 0.11},
    {"year": 1998, "very happy": 0.30, "happy": 0.58,"bot happy": 0.11},
    {"year": 2000, "very happy": 0.31, "happy": 0.58,"bot happy": 0.11},
    {"year": 2002, "very happy": 0.32, "happy": 0.62,"bot happy": 0.10},
    {"year": 2004, "very happy": 0.30, "happy": 0.55,"bot happy": 0.15},
    {"year": 2006, "very happy": 0.30, "happy": 0.57,"bot happy": 0.13},
]
var male1=[
        {"year": 1994, "value": 30},
        {"year": 1996, "value": 32},
        {"year": 1998, "value": 30},
        {"year": 2000, "value": 31},
        {"year": 2002, "value": 32},
        {"year": 2004, "value": 30},
        {"year": 2006, "value": 30},
    ]
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

]
var educ=[
    {"year": 0, "value": 0.5},
    {"year": 1, "value": 0.5},
    {"year": 2, "value": 0.5},
    {"year": 3, "value": 0.4},
    {"year": 4, "value": 0.3},
    {"year": 5, "value": 0.5},
    {"year": 6, "value": 1},
    {"year": 7, "value": 1},
    {"year": 8, "value": 2},
    {"year": 9, "value": 2},
    {"year": 10, "value": 3},
    {"year": 11, "value": 4},
    {"year": 12, "value": 26},
    {"year": 13, "value": 9},
    {"year": 14, "value": 12},
    {"year": 15, "value": 5},
    {"year": 16, "value": 17},
    {"year": 17, "value": 4},
    {"year": 18, "value": 5},
    {"year": 19, "value": 2},
    {"year": 20, "value": 1},

]

var dataSet=female1;
var dataSet2=male1;
var rectPadding = width/(2*dataSet.length);

var formatNumber = d3.format(",d");

var yMax = Math.round(d3.max(dataSet, function(d){return d.value}))

var x = d3.scaleTime()
    .domain([d3.min(d3.extent(dataSet, function (d) { return new Date(parseInt(d.year),0); }))
        ,d3.max(d3.extent(dataSet, function (d) { return new Date(parseInt(d.year),0); }))])
    .range([rectPadding, width-rectPadding]);

var y = d3.scaleLinear()
    .domain([0, yMax])
    .range([height, 0]);

var xAxis = d3.axisBottom(x)
    .tickSize(0)
    .ticks(dataSet.length)
    .tickFormat(d3.timeFormat("%Y"));

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

g.selectAll(".male")
    .data(dataSet2)
    .enter()
    .append('rect')
    .attr('class','male')
    .attr("x",function(d,i){
        return (i+0.5)*rectPadding+(width/dataSet2.length-rectPadding)*i;
    })
    .attr("y",function(d){
        return height-height*(d.value/yMax);
    })
    .attr("width", (width/dataSet2.length-rectPadding)/2)
    .attr("height",function(d){
        return height*(d.value/yMax);
    })
    .attr("fill","blue")
    .on('mouseover', function (d) {
        d3.select(this).attr('fill','green');
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
        d3.select(this).attr('fill','blue');
        var xPos = +d3.select(this).attr("x")
        var wid = +d3.select(this).attr("width");
        d3.select(this).attr("x", xPos + 4).attr("width", wid - 8);
        d3.select('.tip').remove();
    });



g.selectAll(".female")
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('class','female')
    .attr("x",function(d,i){
        return (i+0.5)*rectPadding+(width/dataSet.length-rectPadding)*(i+1/2);
    })
    .attr("y",function(d){
        return height-height*(d.value/yMax);
    })
    .attr("width", (width/dataSet.length-rectPadding)/2)
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
        var xPos = +d3.select(this).attr("x");
        var wid = +d3.select(this).attr("width");
        d3.select(this).attr("x", xPos + 4).attr("width", wid - 8);
        d3.select('.tip').remove();
    });





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
    .text("Happiness for different gender")
    .style("font-size","20px");

svg.append("text")
    .attr("x",30)
    .attr("y",45)
    .attr('class','bree')
    .text("in percentages")
    .style("font-size","12px");


svg.append('text')
    .attr('x', 275)
    .attr('y', 55)
    .attr('class', 'bree')
    .text('Male')
    .attr('font-size', 12);

svg.append('text')
    .attr('x', 335)
    .attr('y', 55)
    .attr('class', 'bree')
    .text('Female')
    .attr('font-size', 12);

svg.append('rect')
    .attr('x', 306)
    .attr('y', 45)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'blue');

svg.append('rect')
    .attr('x', 320)
    .attr('y', 45)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'red');