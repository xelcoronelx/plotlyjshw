function buildMetadata(sample) {

  
  // Use d3 to select the panel with id of `#sample-metadata`
  var panel=d3.select("#sample-metadata")
  // Use `.html("") to clear any existing metadata
  panel.html("")
  //Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(data) {
    console.log(data);
    //Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(([key, value]) => panel.append('h6')
    .text(`${key} : ${value}`));
  });
      

};
function buildCharts(sample) {

  //Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(data) {

    //Build a Bubble Chart using the sample data
    var trace1={
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      type: "scatter",
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids,
        colorscale: "Jet"
      }
    }
    var layout = {
      xaxis: { title: "OTU ID" },
      yaxis: { title: "OTU VALUES" },

    };   
    var data1=[trace1]
    Plotly.newPlot("bubble", data1, layout)


    //Build a Pie Chart
    var trace2={
      values: data.sample_values.slice(0,10),
      labels: data.otu_ids.slice(0,10),
      hovertext: data.otu_labels,
      type: "pie"
    }
    var data2=[trace2]
    Plotly.newPlot("pie", data2)
  });

  };
   

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();