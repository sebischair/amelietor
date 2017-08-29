import * as d3 from 'd3';

function getNode(data) {
  let svg = d3.select("svg");
  svg.selectAll("*").remove();

  let qaFilteredData = data.filter(d => d.value.find(v => v > 0) > 0);
  if(qaFilteredData.length > 0) {
    let margin = {top: 20, right: 50, bottom: 30, left: 20}, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;
    let keys = ["Structural decision", "Behavioral decision", "Non-existence - ban decision"];
    let x = d3.scaleBand().rangeRound([0, width]).padding(0.3).align(0.3);
    let y = d3.scaleLinear().rangeRound([height, 0]);
    let z = d3.scaleOrdinal(d3.schemeCategory20);
    let format = d3.format(",d");
    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    qaFilteredData.map(qa => {
      keys.map((k, i) => { qa.value[i] = +qa.value[i]; qa[k] = qa.value[i]; });
      qa.total = qa.value.reduce((a, b) => a + b, 0);
    });

    qaFilteredData.sort((a, b) => b.total - a.total);

    x.domain(qaFilteredData.map(d => d.id));
    y.domain([0, d3.max(qaFilteredData, d => d.total)]).nice();
    z.domain(keys);

    g.selectAll(".series")
      .data(d3.stack().keys(keys)(qaFilteredData))
      .enter().append("g")
      .attr("class", "series")
      .attr("fill", d => z(d.key))
      .selectAll("rect")
      .data(d => d)
      .enter().append("rect")
      .attr("class", "segment")
      .attr("x", d => x(d.data.id))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth());


    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Count");

    let legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d);

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
