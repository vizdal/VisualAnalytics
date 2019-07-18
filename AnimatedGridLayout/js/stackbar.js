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
            margin = {top: 35, left: 35, bottom: 0, right: 0},
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
  console.log(d);
  return d.total})]).nice();
svg.selectAll(".y-axis").transition().duration(speed)
  .call(d3.axisLeft(y).ticks(null, "s"))

/*data.sort(d3.select("#sort").property("checked")
  ? (a, b) =>{
    console.log(a);
    b.total - a.total}
  : (a, b) => {
    console.log(a,b);
    states.indexOf(a.State) - states.indexOf(b.State)})*/

x.domain(data.map(d => d.State));
svg.selectAll(".x-axis").transition().duration(speed)
  .call(d3.axisBottom(x).tickSizeOuter(0))
var group = svg.selectAll("g.layer")
  .data(d3.stack().keys(keys)(data), d => {d.key})
group.exit().remove()

group.enter().append("g")
  .classed("layer", true)
  .attr("fill", d => z(d.key));
var bars = svg.selectAll("g.layer").selectAll("rect")
  .data(d =>d, e => e.data.State);

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
