import * as d3 from 'd3';

function getNode(data, defaultHeight, defaultWidth) {
  let svg = d3.select('svg');
  svg.selectAll('*').remove();
  let width = defaultWidth,
    height = defaultHeight,
    color = d3.scaleOrdinal(d3.schemeCategory20c);

  let bubble = d3
    .pack()
    .size([width, height])
    .padding(1);

  let format = d3.format(',d');

  let qaFilteredData = data.filter(d => d.value > 0);
  if (qaFilteredData.length > 0) {
    let root = d3
      .hierarchy({ children: qaFilteredData })
      .sum(function(d) {
        return d.value;
      })
      .each(function(d) {
        if ((id = d.data.id)) {
          var id,
            i = id.lastIndexOf('.');
          d.id = id;
          d.package = id.slice(0, i);
          d.class = id.slice(i + 1);
        }
      });

    bubble(root);
    let node = svg
      .selectAll('.node')
      .data(root.children)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => 'translate(' + d.x + ',' + d.y + ')');

    node.append('title').text(d => d.class + '\n Design decisions: ' + format(d.data.value));

    node
      .append('circle')
      .attr('id', d => d.id)
      .attr('r', d => d.r)
      .style('fill', d => color(d.package));

    node
      .append('text')
      .text(d => (d.data.id + ' (' + format(d.data.value) + ')').substring(0, d.r / 3))
      .attr('dy', '.3em')
      .style('text-anchor', 'middle')
      .style('font-size', function(d) {
        let len = d.id.substring(0, d.r / 3).length;
        let size = d.r / 4;
        size *= 10 / len;
        size += 1;
        return Math.min(20, Math.round(size)) + 'px';
      });
  } else {
    svg
      .append('text')
      .text('There is no data for this year. Please select another year.')
      .attr('x', '300')
      .attr('y', '200');
  }

  return svg;
}

function redraw(data, year, defaultHeight, defaultWidth) {
  let newData = data.map(d => {
    d.value = d.values.filter(v => v.year == year)[0].value;
    return d;
  });
  return getNode(newData, defaultHeight, defaultWidth);
}

let d3BubbleChart = {
  getNode: getNode,
  redraw: redraw
};

export default d3BubbleChart;
