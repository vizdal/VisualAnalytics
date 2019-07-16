window.addEventListener('DOMContentLoaded', (event) =>{
  var format = d3.format(",");
  // Set tooltips
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([-10, 0])
              .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Happiness Score: </strong><span class='details'>" + format(d.happiness) +"</span>";
              })

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = 1020 - margin.left - margin.right,
      height = 560 - margin.top - margin.bottom;

  var path = d3.geoPath();
  var index = 0;
  const MIN_YEAR = 2005;
  const MAX_YEAR = 2018;
  var index = 0;
  var svg = d3.select("#worldMapLoad")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', 'map');

  var projection = d3.geoMercator()
                     .scale(130)
                    .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);

  svg.call(tip);

  d3.json("world_countries.json").then(data =>{
    d3.csv("Final-World-Happiness.csv").then(happiness => {
      ready(data,filterData(happiness,MIN_YEAR),MIN_YEAR);
      setInterval(function(){
        index++;
        if(MIN_YEAR + index > MAX_YEAR){
          index = 0;
        }
        ready(data,filterData(happiness,MIN_YEAR+index),MIN_YEAR+index);
      }, 2000);

    });
  });
  filterData = function(data,year = 2018){
    return data.filter(d => { return d.Year == year});;
  }
  function ready(data, population,year = 2005) {
    var populationById = {};

    var color = d3.scaleSequential()
        .domain([d3.min(population, d => d['Positive affect']),d3.max(population, d => d['Positive affect'])]);

    population.forEach(function(d) { populationById[d['Country name']] = +d['Positive affect']; });
    data.features.forEach(function(d) { d.happiness = populationById[d.properties.name] });
    document.getElementById("yearDisplay").innerHTML = year;
    let svgG = svg.append("g").attr("class", "countries");
    const pathElements = svgG.selectAll("path").data(data.features);
    pathElements.join(
      create => {
            create.append("path")
            .attr("d", path)
            .style("fill", function(d) {
              color_ret = d3.interpolateReds(color(populationById[d.properties.name]))
              return color_ret; })
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity",0.8)
            // tooltips
              .style("stroke","white")
              .style('stroke-width', 0.3)
              .on('mouseover',function(d){
                tip.show(d);

                d3.select(this)
                  .style("opacity", 1)
                  .style("stroke","white")
                  .style("stroke-width",3);
              })
              .on('mouseout', function(d){
                tip.hide(d);
                d3.select(this)
                  .style("opacity", 0.8)
                  .style("stroke","white")
                  .style("stroke-width",0.3);
              });3

      },
      update => update.transition().duration(1000)
      .attr("d", path)
      .style("fill", function(d) {
        color_ret = d3.interpolateWarm(color(populationById[d.properties.name]))
        return color_ret; })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
    );
    svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
         // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
        .attr("class", "names")
        .attr("d", path);
  }

});
