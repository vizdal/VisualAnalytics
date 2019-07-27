const a=0.45
const b=0.5
    let cilents=[
        {
            name:"h1",
            Weight:188,
            Height:88
        },
        {
            name:"h2",
            Weight:130,
            Height:88
        },
        {
            name:"h3",
            Weight:170,
            Height:88
        }
    ]
    function getBMI(client) {
        let h=1;
        let h1=2;
        let BMI=client.Weight+client.Height;
        return BMI
    }

    for(let i=0; i<cilents.length;i++){
        if(getBMI(cilents[i])<250){
            document.write(cilents[i].name+": "+getBMI(cilents[i]))
        }
    }
    //document.write(cilent.name+": "+getBMI(cilent))