import * as d3 from 'd3';

function getNode(data) {
  let svg = d3.select("svg");
  let width = 960, height = 640, color = d3.scaleOrdinal(d3.schemeCategory20c);

  let bubble  = d3.pack()
    .size([width, height])
    .padding(1);

  let format = d3.format(",d");

  let qaFilteredData = data.filter(d => {
    return d.value > 0;
  });

  let root = d3.hierarchy({children: qaFilteredData})
    .sum(function(d) { return d.value; })
    .each(function(d) {
      if(id = d.data.id) {
        var id, i = id.lastIndexOf(".");
        d.id = id;
        d.package = id.slice(0, i);
        d.class = id.slice(i + 1);
      }
    });

  bubble(root);
  let node = svg.selectAll(".node")
    .data(root.children)
    .enter().append("g")
    .attr("class", "node")
    .attr("transform", d => "translate(" + d.x + "," + d.y + ")");

  node.append("title")
    .text(d => d.id + ": " + format(d.value));

  node.append("circle")
    .attr("id", d => d.id)
    .attr("r", d => d.r)
    .style("fill", d => color(d.package));

  node.append("text")
    .text(d => (d.data.id + " (" + format(d.data.value) + ")").substring(0, d.r / 3))
    .attr("dy", ".3em")
    .style("text-anchor", "middle")
    .style("font-size", function(d) {
      let len = d.id.substring(0, d.r / 3).length;
      let size = d.r/4;
      size *= 10 / len;
      size += 1;
      return Math.min(20, Math.round(size))+'px';
    });

  svg.on("mount", function () {
    applyTransition()
  });

  return svg;
}

function applyTransition() {
  let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  d3.selectAll('circle')
    .transition()
    .delay(function(d,i){ return i * (circleAnimation / 4); })
    .style('opacity', 1);

  d3.selectAll('circle').on('mouseover', function(d, i){
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html( d.data.id + "<br/> Design decisions: " + format(d.data.value))
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on('mouseout', function(d, i){
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });

}

let d3BubbleChart = {
  getNode: getNode
};

export default d3BubbleChart;
