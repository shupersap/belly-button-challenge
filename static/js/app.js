const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let data;

function getData() {
  return d3.json(dataUrl)
    .then((jsonData) => {
      data = jsonData;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

const createDropdown = () => {
  const dropdownMenu = d3.select("#selDataset");
  const testIds = data.names;
  testIds.forEach((id) => {
    dropdownMenu
      .append("option")
      .text(id)
      .property("value", id);
  });
};

const createDemographicInfo = (subject) => {
  const metaData = data.metadata;
  const result = metaData.find((sampleObject) => sampleObject.id == subject);
  const demographicPanel = d3.select("#sample-metadata");
  demographicPanel.html("");
  Object.entries(result).forEach(([key, value]) => {
    demographicPanel.append("h6").text(`${key}: ${value}`);
  });
};

const createCharts = (subject) => {
  const samples = data.samples;
  const sampleValues = samples.find((sampleObject) => sampleObject.id == subject).sample_values;
  const otuIds = samples.find((sampleObject) => sampleObject.id == subject).otu_ids;
  const otuLabels = samples.find((sampleObject) => sampleObject.id == subject).otu_labels;

  const barData = [
    {
      x: sampleValues.slice(0, 10).reverse(),
      y: otuIds.slice(0, 10).map((otuId) => `OTU ${otuId}`).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    },
  ];

  Plotly.newPlot("bar", barData);

  const bubbleData = [
    {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues,
      },
    },
  ];

  const bubbleLayout = {
    xaxis: { title: "OTU ID" },
    hovermode: "closest",
  };

  Plotly.newPlot("bubble", bubbleData, bubbleLayout);
};

const optionChanged = (newSample) => {
  createCharts(newSample);
  createDemographicInfo(newSample);
};

const main = async () => {
  await getData();
  createDropdown();
  createDemographicInfo(data.names[0]);
  createCharts(data.names[0]);
};

main();