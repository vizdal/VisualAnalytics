let container =d3.select("#container")
function write(text){
    container.append("div").text(text)
}
d3.csv("femaledata.csv").then(function(data){
    data.sort(()=>{
        return d3.ascending(a.Name,b.Name)
    })
    let filteredData=data.filter(d=>{
        return d.famale<200
    })
    showData(filteredData)
})
d3.csv("femaledata.csv").then(function(data){
    write("data is available")
    for (let female of data){
         write(female)
    }
    // for(let i = 0; i < data.length;i++){
    //     console.log(data[i].female)
    // }


    })
function showData
write ("line after")
