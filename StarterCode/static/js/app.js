let samples
let metadata

const dataPromise = d3.json('samples.json')

dataPromise.then(function(data) {
  // Store in variables
  const names = data.names
  metadata = data.metadata
  samples = data.samples

  buildBarChart(data.names[0])

  const selectElement = document.getElementById('selDataset')


  names.forEach(function(name) {
    const option = document.createElement('option')
    option.value = name
    option.text = name
    selectElement.appendChild(option)
  })
})

function buildBarChart(selectedID) {
  // Get the info data for the selected Id
  let selectedSample = samples.find(sample => sample.id === selectedID)

  let topOTU = selectedSample.otu_ids.slice(0, 10)
  let topVal = selectedSample.sample_values.slice(0, 10)
  let topLab = selectedSample.otu_labels.slice(0, 10)

  let barData = [{
    type: 'bar',
    x: topVal,
    y: topOTU.map(otu => `OTU ${otu}`),
    text: topLab,
    orientation: 'h'
  }];

  let barLayout = {
    title: `Top 10 OTUs for Subject ID# ${selectedID}`,
    xaxis: { title: 'Samples' },
    yaxis: { title: 'ID' }
  };

  Plotly.newPlot('bar', barData, barLayout);
  buildMetadataPanel(selectedID)
}





function buildMetadataPanel(selectedID) {
  let selectedMetadata = metadata.find(entry => entry.id === parseInt(selectedID))
  const metadataPanel = document.getElementById('sample-metadata')
  metadataPanel.innerHTML = ''
  Object.entries(selectedMetadata).forEach(([key, value]) => {
    const metadataInfo = document.createElement('p');
    metadataInfo.innerHTML = `<strong>${key}:</strong> ${value}`
    metadataPanel.appendChild(metadataInfo);
  });
}

function optionChanged(selectedID) {
  buildBarChart(selectedID)
  buildMetadataPanel(selectedID)
}