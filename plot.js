// console.log('Plot file running.');
// console.log(d3);
// "use strict"

let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();
req.open('GET',url,true)
req.onload = () => {
  data = JSON.parse(req.responseText);
  values = data.data;
  // console.log(values); // values[0][0] = '1947-01-01' // values[0][1] = 243.1

  // Making the plot element by element
  drawCanvas();
  generateScales();
  drawBars();
  generateAxes();
}
req.send();

let data;
let values;

let heightScale;
let xScale;
let xAxisScale;
let yAxisScale;

let canvasScaleFactor = 0.9;
let width = 1600*canvasScaleFactor;
let height = 900*canvasScaleFactor;

let padding = 80;

let svg =   d3.select("svg");

let drawCanvas = () => {
  svg.attr("width",width)
     .attr("height",height)
};

let generateScales = () => {
  heightScale = d3.scaleLinear()
                  .domain([0,d3.max(values,item => item[1])])
                  .range([0,(height-2*padding)]);

  xScale = d3.scaleLinear()
             .domain([0,values.length-1]) // This is x-axis bound of values
             .range([padding,(width-padding)]); // This is x-axis position

  let datesArray = values.map(d => new Date(d[0]));
  xAxisScale = d3.scaleTime()
                 .domain([d3.min(datesArray),d3.max(datesArray)])
                 .range([padding,(width-padding)]);

  yAxisScale = d3.scaleLinear()
                 .domain([0,d3.max(values,item=>item[1])])
                 .range([(height-padding),padding]);
}

let generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);

  svg.append('g')
     .call(xAxis)
     .attr("id","x-axis")
     .attr("transform","translate(0," + (height-padding) + ")");

  let yAxis = d3.axisLeft(yAxisScale);
  svg.append('g')
     .call(yAxis)
     .attr("id","y-axis")
     .attr("transform","translate(" + padding + ",0)");
}

let drawBars = () => {

  let tooltip = d3.select('body')
                  .append('div')
                  .attr('id','tooltip')
                  .style('visibility','hidden')
                  .style('height','auto')
                  .style('width','auto')
                  .style('text-align','center')

  svg.selectAll('rect')
     .data(values)
     .enter()
     .append('rect')
     .attr("class","bar")
     .attr("width",((width-2*padding)/values.length))
     .attr("data-date",item=>item[0])
     .attr("data-gdp",item=>item[1])
     .attr("height",item=>heightScale(item[1]))
     .attr('x',(item,index)=>xScale(index))
     .attr('y',item=>height-padding-heightScale(item[1]))
     .on('mouseover',item=>{
       tooltip.transition()
              .style('visibility','visible');
       tooltip.text('Date: '+item[0]+", GDP: "+item[1]);

       document.querySelector('#tooltip').setAttribute('data-date',item[0])

       document.querySelector('#tooltip').onfocus = (document.querySelector('#tooltip').style.background = 'cyan');
     })
     .on('mouseout',item=>{
       tooltip.transition()
              .style('visibility','hidden');
       document.querySelector('#tooltip').onfocus = (document.querySelector('#tooltip').style.background = 'cyan');
       tooltip.text('US GDP Time Series Data');
     })
}

console.log('Plot file executed.');
