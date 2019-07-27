d3.csv("data/prep_indicators.csv").then(d => chart(d))
function chart(csv) {
  req_columns = csv.columns.slice(2,csv.columns.length-1);
  var keys = [...new Set(csv.map(d => +d.happy))];
  var year   = [...new Set(csv.map(d => d.year))]
  var options = d3.select("#year").selectAll("option")
                  .data(year)
                  .enter().append("option")
                  .text(d => d);
  var attributes = d3.select("#attributes").selectAll("option")
                     .data(req_columns).enter().append('option').text(d => d);
  var svg = d3.select("#chart"),
            margin = {top: 35, left: 50, bottom: 30, right: 20},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom;
 var x = d3.scaleBand()
           .range([margin.left, width - margin.right])
           .padding(0.1)
 var y = d3.scaleLinear()
           .rangeRound([height - margin.bottom, margin.top])
 var xAxis = svg.append("g")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .attr("class", "x-axis")
var yAxis = svg.append("g")
               .attr("transform", `translate(${margin.left},0)`)
               .attr("class", "y-axis")
var xLbl = svg.append("g")
               .attr("transform", `translate(0,${height - margin.bottom})`)
               .attr("class", "xLabel");
var yLbl = svg.append("g")
               .attr("transform", `translate(${margin.left},0)`)
               .attr("class", "yLabel");

var z = d3.scaleOrdinal()
          .range(["#F56D74", "#B69D84", "#95D5D2"])
          .domain(keys);
update(d3.select("#year").property("value"), 0)
function update(input, speed, col = 'workstat') {
    var data = csv.filter(f => f.year == input)
    var states = [...new Set(csv.map(d => d[col]))]
    let dataMap = {};
    let max = -1;
    states.forEach(d => {
      let filteredData = data.filter(s => s[col] == d);
      let tempMap = {}
      filteredData.forEach(l => {
        if(tempMap[l.happy] === undefined){
          tempMap[l.happy] = 1;
          if(max < 1){ max = 1;}
        } else {
          let val = tempMap[l.happy] + 1
          if(max < val){max = val;}
          tempMap[l.happy] = val;
        }
      });
      dataMap[d] = tempMap;
    });
    data = []
    states.forEach((d,i) => {
      let val = dataMap[d]
      val['Year'] = input;
      val['State'] = d;
      let sum = 0;
      if(val[0] !== undefined){
        sum += val[0];
      }
      if(val[1] !== undefined){
        sum += val[1];
      }
      if(val[2] !== undefined){
        sum += val[2];
      }
      val['total'] = sum;
      data.push(val);
    });

y.domain([0, d3.max(data,d => {
  return d.total})]).nice();
svg.selectAll(".y-axis").transition().duration(speed)
  .call(d3.axisLeft(y).ticks(null, "s"))
//", "", "#95D5D2
  svg.append("circle").attr("cx",500).attr("cy",90).attr("r", 6).style("fill", "#95D5D2")
  svg.append("circle").attr("cx",500).attr("cy",70).attr("r", 6).style("fill", "#B69D84")
  svg.append("circle").attr("cx",500).attr("cy",50).attr("r", 6).style("fill", "#F56D74")
  svg.append("text").attr("x", 520).attr("y", 90).text("Very happy").attr("fill","#95D5D2").style("font-size", "0.68em").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 520).attr("y", 70).text("Pretty happy").attr("fill","#B69D84").style("font-size", "0.68em").attr("alignment-baseline","middle")
  svg.append("text").attr("x", 520).attr("y", 50).text("Not too happy").attr("fill","#F56D74").style("font-size", "0.68em").attr("alignment-baseline","middle")

x.domain(data.map(d => d.State));
svg.selectAll(".x-axis").transition().duration(speed)
  .call(d3.axisBottom(x).ticks(10,"s")).selectAll("text").style("text-anchor", "start")
        .attr("dx", "1em")
        .attr("dy", "-0.5em").attr("transform","rotate(90)");
// To Add x Label
var xLa = svg.select(".xLabel");
xLa.selectAll("text").remove();
xLa.append("text").text(col).style("text-anchor","middle").style("font-size","0.6em")
   .style("font-weight","bold").style("text-transform","uppercase").attr("transform","translate("+ svg.attr("width")/2 +",90)");
// TO add y Label
var yLa = svg.select(".yLabel");
yLa.selectAll("text").remove();
yLa.append("text").text("Categorical Count of "+ col).style("text-anchor","middle").style("font-size","0.6em")
   .style("font-weight","bold").style("text-transform","uppercase").attr("transform","translate(-45,"+svg.attr("height")/2+") rotate(90)");

var group = svg.selectAll("g.layer")
  .data(d3.stack().keys(keys)(data), d => {d.key})
group.exit().remove()

group.enter().append("g")
  .classed("layer", true)
  .attr("fill", d => z(d.key));
//Append axis
//var xais = svg.selectAll("g.xaxislab");
//xais.exit().remove();
//xais.enter().append("g").classed("xaxislab",true).append("text").text(col);
var bars = svg.selectAll("g.layer").selectAll("rect")
  .data(d =>d, e => e.data.State);
//var xaxislab = svg.selectAll("g.xaxislab").select("text").remove().append("text").text(col);
bars.exit().remove()

bars.enter().append("rect")
  .attr("width", x.bandwidth())
  .merge(bars)
.transition().duration(speed)
  .attr("x", d => x(d.data.State))
  .attr("y", d => y(d[1]))
  .attr("height", d => y(d[0]) - y(d[1]))

var text = svg.selectAll(".text")
  .data(data, d => d.State);

text.exit().remove()

text.enter().append("text")
  .attr("class", "text")
  .attr("text-anchor", "middle")
  .merge(text)
.transition().duration(speed)
  .attr("x", d => x(d.State) + x.bandwidth() / 2)
  .attr("y", d => y(d.total) - 5)
  .text(d => d.total)
}

var select = d3.select("#year")
.on("change", function() {
  update(this.value, 750,document.getElementById("attributes").value);
})
var selectCol = d3.select("#attributes")
  .on("change", function() {
    update(document.getElementById("year").value, 750,this.value);
  })
var checkbox = d3.select("#sort")
.on("click", function() {
  update(select.property("value"), 750);
})
}
