//REFERENCES
//https://roundsliderui.com
//https://roundsliderui.com/playground.html
//https://color.adobe.com/search?q=Green
//https://bl.ocks.org/d3noob/629790fc15cc1afba0253f29a4d246e7

var happiness_data,indicator_happiness;
document.getElementById('wmapParent').addEventListener("click", (event) =>{
  var format = d3.format(",");
  var interval = null;
  var ttip = d3.select('#worldMapParent').append("div")
              .attr("class", "tooltip")
              .style("opacity", 0);
  var textRegion = ttip.append('div').attr("id","areaText");
  var areaPlot = ttip.append('div').attr("id","areaPlotHover");
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
  //var data,happiness

    d3.json("data/world_countries.json").then(cdata =>{
      d3.csv("data/Final-World-Happiness.csv").then(chappiness => {
        happiness_data = cdata;indicator_happiness=chappiness;
        readAndStart(2018);
      });
    });;

//  svg.call(tip);
  window.filterData = function(data,year = 2018){
    return data.filter(d => { return d.Year == year});;
  }
  window.startIteration = function(){
    interval = setInterval(function(){
      if(MAX_YEAR - index < MIN_YEAR){
        index = 0;
      }
      readAndStart(MAX_YEAR - index);
      index++;
    }, 2000);
  }
  window.stopIteration = function(){
    clearInterval(interval);
  }
  window.ready = function(data, population,year = 2005,extra = undefined) {
    var populationById = {};
    var color = d3.scaleSequential()
        .domain([0,d3.max(population, d => d['Positive affect'])]);
    population.forEach(function(d) { populationById[d['Country name']] = +d['Positive affect']; });
    data.features.forEach(function(d) { d.happiness = populationById[d.properties.name] });
    let svgG = svg.append("g").attr("class", "countries");
    d3.select(".centertextwd").remove();
    const textElem = svgG.append("text").attr("class","centertextwd").attr("font-size","4em")
                    .attr("fill","#D9D9D9").attr("x",50).attr("y",height)
                    .text(year);
    const pathElements = svgG.selectAll("path").data(data.features);
    pathElements.join(
      create => {
            create.append("path")
            .attr("d", path)
            .style("fill", function(d) {
              color_ret = d3.interpolateGreens(color(populationById[d.properties.name]))
                if(populationById[d.properties.name] === undefined)
                return "#D0D0D0";
              return color_ret; })
            .style('stroke', 'white')
            .style('stroke-width', 1.5)
            .style("opacity",0.8)
            // tooltips
              .style("stroke","white")
              .style('stroke-width', 0.3)
              .on('mouseover',function(d){
              let country = d['properties']['name'];
              document.getElementById('areaPlotHover').innerHTML = '';
              createAreatChart('#areaPlotHover',country);
              ttip.transition().duration(200).style("opacity", .9);
              let html = "<div><span style='color:red;'>Country:</span>"+country+"</div><div><span style='color:red;'>Happiness Score:</span>"+d['happiness']+"</div>";
              textRegion.html(html + "<br/>");
                ttip.style("left", (d3.event.x - 300) + "px")
              .style("top", (d3.event.y - 40) + "px");

                d3.select(this)
                  .style("opacity", 1)
                  .style("stroke","white")
                  .style("stroke-width",3);
              })
              .on('mouseout', function(d){
                //tip.hide(d);
                ttip.transition()
                .duration(500)
                .style("opacity", 0);

                d3.select(this)
                  .style("opacity", 0.8)
                  .style("stroke","white")
                  .style("stroke-width",0.3);
              });

      },
      update => update.transition().duration(1000)
      .attr("d", path)
      .style("fill", function(d) {
        color_ret = d3.interpolateWarm(color(populationById[d.properties.name]))
        return color_ret; })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      .style("stroke","white")
      .style('stroke-width', 0.3)
  );
    svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);
  }
});
readAndStart = function(year){
  $("#worldmapCircle").roundSlider({
      value: year,
  });
  ready(happiness_data,filterData(indicator_happiness,year),year,indicator_happiness);
}
