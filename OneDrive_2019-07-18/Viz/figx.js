const KG_PER_POUND=0.45
const METER_PER_INCH=0.0254
let container=d3.select("#container")
d3.csv("femaledata.csv").then(showData)
function write(text){
    container.append("div").text(text)
}
// let clients=[{
//     Name:"Client0"
// }]
// let count=1
// function addNewClient(){
//     clients.push({Name:"Client"+count})
//     count+=1
//     showData(clients)
// }
// function removeClient(){
//
//     clients=clients.slice(0,-1)
//     count-=1
//     showData(clients)
// }
function showData(clients){
    let max=d3.max(clients,d=>d.Weight)
    let scale=d3.scaleLiner()
        .range([0,300])
        .domain([0,max])

    let positionScale=d3.scaleBand()
        .range([0,200])
        .domain(clients.map(d =>d.Name))
        .padding(0.3)

    let join=container
        .selectAll("rect")
        .data(clients);

    join.enter()
        .append("rect")
        .attr("fill","blue")
        .attr("width",d=>widthScale(d.Weight))
        .attr("height",positionScale.bandwith())
        .attr("y",d=>positionScale(d.Name))
    // join.enter()
    //     .append("div")
    //     .text(d =>d.Name+":"+scale(d.Weight))
    //     .style("background-color","blue")
    //     .style("margin","5px")
    //     .style("color","white")
    //     .style("width",d => scale(d.Weight))

    // join.exit().remove()
    // join.text(d =>d.Name+": updater")
}
showData(clients)