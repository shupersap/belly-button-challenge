const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let data;

const getData = async () => {
  data = await d3.json(dataUrl);
};

const createDropdown = () => {
  const dropdownMenu = d3.select("#selDataset");
  const { names } = data;
  names.forEach((id) => dropdownMenu.append("option").text(id).property("value", id));
};

const createDemographicInfo = (subject) => {
  const { metadata } = data;
  const result = metadata.find(({ id }) => id == subject);
  const demographicPanel = d3.select("#sample-metadata");
  demographicPanel.html("");
  Object.entries(result).forEach(([key, value]) => demographicPanel.append("h6").text(`${key}: ${value}`));
};

const createCharts = (subject) => {
  const { samples } = data;
  const { sample_values, otu_ids, otu_labels } = samples.find(({ id }) => id == subject);

  const barData = [{
    x: sample_values.slice(0, 10).reverse(),
    y: otu_ids.slice(0, 10).map((id) => `OTU ${id}`).reverse(),
    text: otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h",
  }];

  Plotly.newPlot("bar", barData);

  const bubbleData = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      color: otu_ids,
      size: sample_values,
    },
  }];

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

const main = () => {
  return getData()
    .then(() => {
      createDropdown();
      createDemographicInfo(data.names[0]);
      createCharts(data.names[0]);
    });
};

main();