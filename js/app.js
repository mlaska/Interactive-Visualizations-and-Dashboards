function Init()
{
    console.log("Initializing Screen");
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((x) => {
        var sampleNames = x.names;

        sampleNames.forEach((ID) => {
            selector
                .append("option")
                .text(ID)
                .property("value", ID);

        });

    });
    var sampleID = 940    
    DrawBargraph(sampleID);
    DrawBubbleChart(sampleID);
    ShowMetadata(sampleID);

}

function ShowMetadata(ID)
{
    console.log("ShowMetadata: sample = ", ID);

    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == ID);
        var result = resultArray[0];
       
        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        
        Object.entries(result).forEach(([key, value]) => {
            var textToShow = `${key.toUpperCase()}: ${value}`;
            PANEL.append("h6").text(textToShow);       
    });
    });
}

function DrawBargraph(ID)
{
    console.log("DrawBargraph: sample = ", ID);
    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == ID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [
            {
                x: sample_values.slice(0, 10).reverse(),
                y: yticks,
                type: "bar",
                text: otu_labels.slice(0, 10).reverse(),
                orientation: "h"
            }
        ];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", barData, barLayout);
});

}

function DrawBubbleChart(ID)
{
    console.log("DrawBubbleChart: sample = ", ID);
    
    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray =samples.filter(sampleObj => sampleObj.id == ID);
        var result = resultArray[0];
        
        var otu_ids  = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;
    
        var bubble_chart = {
    
          mode: "markers",
          x: otu_ids,
          y: sample_values,
          text: otu_labels, 
          marker: {color: otu_ids, colorscale: "Rainbow", size: sample_values}
    
        };
    
        var bubble_data = [bubble_chart];
    
        var bubble_layout = {
            title: "Bacteria Culters Per Sample", 
            margin: {t : 0}, 
            hovermode: "closets",
            xaxis: { title: "OTU ID"}, 
            margin: {t : 30}
        };
    
        Plotly.newPlot("bubble", bubble_data, bubble_layout);
});

}   

function optionChanged(newSampleID)
{
    console.log("Dropdown changed to: ", newSampleID);
    
    ShowMetadata(newSampleID);
    DrawBargraph(newSampleID);
    DrawBubbleChart(newSampleID);
}

Init();