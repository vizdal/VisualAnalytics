document.getElementById('scatterPlotParent').addEventListener("click",function(event){
  $('#bubbleOptions').show();
  scatterPlot.init(700,600);
});
const scatterPlot = {
  init: function(height,width){
    this.height = height;
    this.width = width;
    this.columns = undefined;
    this.margin = {
      x: 50,
      y: 50,
    };
    this.svg = d3.select("#graph")
                 .append("svg")
                 .attr("height",height)
                 .attr("width",width);
    this.svgG = this.svg.append("g");
    //Define a group for each axis
    this.leftAxis = this.svg.append("g");
    this.bottomAxis = this.svg.append("g");

    // Move our axis to proper position
    this.leftAxis.attr('transform', `translate(${this.margin.x},0)`)
    this.bottomAxis.attr('transform', `translate(0,${this.height - this.margin.y})`);

    this.leftAxis.append("text")
                 .attr("class","graph-labels")
                 .attr("text-anchor","middle")
                 .attr("transform",`translate(-15,${height/2}) rotate(-90)`);
    this.bottomAxis.append("text")
                   .attr("class","graph-labels")
                   .attr("text-anchor","middle")
                   .attr("transform", `translate(${width/2},${this.margin.y - 15})`);
    const that = this;

    d3.csv("data/Final-World-Happiness.csv").then(function(data){
      //Filter for a year - 2018
      this.columns = data.columns;
      that.createMenu(data);
      const MIN_YEAR = 2005, MAX_YEAR = 2018;
      let index = 0;
      setInterval(function(){
        index++;
        if(MIN_YEAR + index > MAX_YEAR){
          index = 0;
        }
        that.plotGraph(data,MIN_YEAR + index);
      }, 2000);

    });
  },
  filterData: function(data,year = 2018){
    return data.filter(d => { if(d.Year == year){ return d;} });
  },
  colors: [
    {
      name: "Categorical",
      init: function(data) {
        this.scale = d3.scaleOrdinal(d3.schemeCategory10).domain(data.map(d => d.color));
      },
      transform: function(x){
        return this.scale(x);
      }
    },
    {
      name: "Continuous Blue",
      init: function(data) {
        this.scale = d3.scaleLinear().domain([d3.min(data, d=>d.color),d3.max(data,d=>d.color)]);
      },
      transform: function(x) {
        return d3.interpolateBlues(this.scale(x));
      }
    }
  ],
  createMenu: function(data){
    this.menuX = d3.select("#menu-x");
    this.menuY = d3.select("#menu-y");
    this.menuColor = d3.select("#menu-color");
    //Options for color
    this.colors.forEach((color,i) => {
      this.menuColor.append("option").attr("value",i).text(color.name);
    });
    //Options for columns
    let unwanted_columns = ['Year','Country name','Positive affect','Negative affect'];
    data.columns.slice(0,data.columns.length).forEach((name,i) => {
      if(unwanted_columns.indexOf(name) < 0){
        this.menuX.append("option").attr("value",i).text(name);
        this.menuY.append("option").attr("value",i).text(name);
      }
    });
    this.menuX.node().value = 2;
    this.menuY.node().value = 3;
    this.menuColor.node().value = 0;

    this.menuX.on('change', () => this.plotGraph(data));
    this.menuY.on('change', () => this.plotGraph(data));
    this.menuColor.on('change', () => this.plotGraph(data));
  },
  prepareData: function(data,year){
      function indexColumn(data,column){
        return data.columns[column];
      }
      const columnX = indexColumn(data,this.menuX.node().value);
      const columnY = indexColumn(data,this.menuY.node().value);
      const classColumn = indexColumn(data,data.columns.length-1);
      data = scatterPlot.filterData(data,year);
      return data.map( d => {
        return {
          x: +d[columnX],
          y: +d[columnY],
          classCol: +d['Positive affect'],
          color: d['Country name'],
        }
      });
  },
  plotGraph: function(originalData,year = 2018){
    const data = this.prepareData(originalData,year);
    //Scale scaleLinear
      const xScale = d3.scaleLinear().domain([d3.min(data,d => d.x) - 1,d3.max(data,d => d.x)])
                       .range([this.margin.x,this.width - this.margin.x]);
      const yScale = d3.scaleLinear().domain([d3.min(data,d => d.y) - 1,d3.max(data, d => d.y)])
                       .range([this.margin.y,this.height - this.margin.y]);
      const color = this.colors[this.menuColor.node().value];
      const radScale = d3.scaleLinear().domain([d3.min(data,d => d.classCol),d3.max(data,d => d.classCol)])
                                      .range([0,20]);

    color.init(data);
    this.svgG.select(".centertext").remove();
    const textElem = this.svgG.append("text").attr("class","centertext").attr("font-size","4em")
                    .attr("fill","#D9D9D9").attr("x",this.width-150).attr("y","150")
                    .text(year);

    const circles = this.svgG.selectAll("circle").data(data);
    circles.join(
      create => create.append("circle")
                .attr("cx", d => xScale(d.x))
                .attr("cy", d => yScale(d.y))
                .attr("r", d => radScale(d.classCol))
                .attr("fill", d => color.transform(d.color))
                .attr("stroke","black"),
      update => update.transition().duration(1000)
                      .attr("cx",d => xScale(d.x))
                      .attr("cy",d => yScale(d.y))
                      .attr("r", d => radScale(d.classCol))
                      .attr("fill", d => color.transform(d.color)),
      exit => null,
    );
    const leftAxis = d3.axisLeft(yScale);
    this.leftAxis.transition().duration(1000).call(leftAxis);
    this.leftAxis.select("text").text(originalData.columns[this.menuY.node().value]);

    const bottomAxis = d3.axisBottom(xScale);
    this.bottomAxis.transition().duration(1000).call(bottomAxis);
    this.bottomAxis.select("text").text(originalData.columns[this.menuX.node().value]);
  }
}
