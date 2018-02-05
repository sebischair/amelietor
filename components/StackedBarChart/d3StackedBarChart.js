import * as d3 from 'd3';

function getNode(data) {
  let svg = d3.select("svg");
  svg.selectAll("*").remove();

  let qaFilteredData = data.filter(d => d.value.find(v => v > 0) > 0);
  if(qaFilteredData.length > 0) {
    let margin = {top: 20, right: 50, bottom: 30, left: 20}, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
    let x = d3.scaleBand().rangeRound([0, width]).padding(0.3).align(0.3);
    let y = d3.scaleLinear().rangeRound([height, 0]);
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let colors = d3.scaleOrdinal(d3.schemeCategory20c);

    qaFilteredData.forEach(d => {
      d.id = d.id;
      d.value = +d.value[0];
    });

    qaFilteredData.sort((a, b) => b.value - a.value);

    x.domain(qaFilteredData.map(d => d.id));
    y.domain([0, d3.max(qaFilteredData, d => d.value)]);

    g.selectAll(".series")
      .data(qaFilteredData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.id))
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value))
      .attr("width", x.bandwidth())
      .attr("fill", (d, i) => colors(i));

    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" )
      .attr("font-weight", "bold");

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s").tickSizeInner([-width]))
      .append("text")
      .attr("y", y(y.ticks().pop()))
      .attr("dy", ".32em")
      .style("text-anchor", "end")
      .text("Count");

  } else {
    svg.append('text').text('No Data!').attr("x", "300").attr("y", "300").style("font-size", "20px");
  }
  return svg;
}

function redraw(data, year) {
  let newData = data.map(d => {
    let e = d.values.filter(v => v.year == year);
    if(e.length > 0)
      d.value = e[0].value;
    return d;
  });
  return getNode(newData);
}

let d3StackedBarChart = {
  getNode: getNode,
  redraw: redraw
};

export default d3StackedBarChart;
