const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then(data=>{
    console.log(data)
})


function main() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
      let Test_ID = data.names;
      Test_ID.forEach((subject) => {
        dropdownMenu
          .append("option")
          .text(subject)
          .property("value", subject);
      });
    
      demographicInfo();
      createCharts();
    });
    }

function demographicInfo(subject){
d3.json(url).then(data => {
let metaData = data.metadata
let resultsArray = metaData.filter(sampleobject => sampleobject.id == subject)
console.log(resultsArray)
let result = resultsArray[0]
let demographicPanel = d3.select("#sample-metadata")
demographicPanel.html("")
Object.entries(result).forEach(([key, value]) => {
    demographicPanel.append("h6").text(`${key}: ${value}`);
})
})

}

  function createCharts(subject) {
  
  d3.json(url).then((data) => {
    let samples= data.samples;
    let values= samples.filter(sampleobject => sampleobject.id == subject);
    let value= values[0]
    let ids = value.otu_ids;
    let labels = value.otu_labels;
    let result = value.sample_values;

  let barData =[
    {
      x:result.slice(0,10).reverse(),
      y:ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text:labels.slice(0,10).reverse(),
      type:"bar",
      orientation:"h"

    }
  ];

  Plotly.newPlot("bar", barData);

      let bubbleData = [ 
      {
        x: ids,
        y: result,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: result,
          }
      }
    ];
  
    let bubbleLayout = {
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
        };
    
    
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  
  
  });
  }
   
  function optionChanged(newSample) {

    createCharts(newSample);
    demographicInfo(newSample);
  }
  

  main();