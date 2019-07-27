let who=d3.select("#who")
console.log(who.node())
let ps=d3.selectAll("p")
console.log(ps.nodes())
function change1(){
   let p= d3.select(".main-paragraph")
        p.text("111")
}
function change2(){
    d3.select("p")
        .text("222")
}
function change3(){
    d3.selectAll("p")
        .text("333")
}
function change4(){
    d3.select("p")
        .html("<b>444</b>")
}
let itemlist=d3.select("#itemlist")
function count() {
    return itemlist.selectAll("li")
        .size()
}
function listchange1(){
   let c=count()+1
    itemlist
        .append("li")
        .text("Item"+c)

}
function listchange2(){
    itemlist
        .selectAll("li")
        .remove()

}
function listchange3(){
    itemlist
        .select("li:last-child")
        .remove()

}
function changetodoggy(){
    d3.select("#aa")
        .attr("src","figfin.js")
}
function changetocatty(){
    d3.select("#animalImg")
        .attr("src","catty.jpg")
}
function changecolor() {
     d3.select("#text")
         .style("color","red")
}
