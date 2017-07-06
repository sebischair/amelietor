import * as d3 from 'd3';
import colorbrewer from 'colorbrewer';

function getNode(data) {
  let viz = document.createElement('div');
  viz.setAttribute('id', 'doublescroll');
  //viz.setAttribute('style', 'overflow: auto; overflow-y: hidden;');


  data = data.map(function (item) {
    let newItem = {};
    newItem.personName = item.personName;
    newItem.conceptName = item.conceptName;
    newItem.value = item.value;
    return newItem;
  });

  let x_elements = d3.set(data.map(function (item) {
      return item.personName;
    })).values(),
    y_elements = d3.set(data.map(function (item) {
      return item.conceptName;
    })).values();

  let itemSize = 22,
    cellSize = itemSize - 1,
    margin = {top: 100, right: 10, bottom: 10, left: 100};

  let width = x_elements.length * 25 - margin.right - margin.left,
    height = y_elements.length * 25 - margin.top - margin.bottom;

  let values = d3.set(data.map(function (item) {
    return item.value;
  })).values();

  let xScale = d3.scaleBand()
    .domain(x_elements)
    .range([0, x_elements.length * itemSize]); //rangeBands

  let xAxis = d3.axisTop().scale(xScale).tickFormat(function (d) {
    return d;
  });

  let yScale = d3.scaleBand()//scale.ordinal
    .domain(y_elements)
    .range([0, y_elements.length * itemSize]); //Bands

  let yAxis = d3.axisLeft().scale(yScale).tickFormat(function (d) {
    return d;
  });

  let colors = colorbrewer.OrRd[9]
  let colorScale = d3.scaleQuantile()
    .domain(values)
    .range(colors);

  let svg = d3.select(viz).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let cells = svg.selectAll('rect')
    .data(data)
    .enter().append('g').append('rect')
    .attr('class', 'cell')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('y', function (d) {
      return yScale(d.conceptName);
    })
    .attr('x', function (d) {
      return xScale(d.personName);
    })
    .attr('fill', function (d) {
      return colorScale(d.value);
    });

  cells.append("title").text(function (d) {
    return d.value;
  });

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .selectAll('text')
    .attr('font-weight', 'normal');

  svg.append("g")
    .attr("class", "x axis")
    .call(xAxis)
    .selectAll('text')
    .attr('font-weight', 'normal')
    .style("text-anchor", "start")
    .attr("dx", ".8em")
    .attr("dy", ".5em")
    .attr("transform", function (d) {
      return "rotate(-65)";
    });

  return viz;
}

function doubleScroll(element) {
  element.setAttribute('style', 'overflow-y: auto;');
  let scrollbar= document.createElement('div');
  scrollbar.appendChild(document.createElement('div'));
  scrollbar.style.overflow= 'auto';
  scrollbar.style.overflowY= 'hidden';
  scrollbar.firstChild.style.width= element.scrollWidth+'px';
  scrollbar.firstChild.style.paddingTop= '1px';
  scrollbar.firstChild.appendChild(document.createTextNode('\xA0'));
  scrollbar.onscroll= function() {
    element.scrollLeft= scrollbar.scrollLeft;
  };
  element.onscroll= function() {
    scrollbar.scrollLeft= element.scrollLeft;
  };

  element.parentNode.insertBefore(scrollbar, element);
}


let d3BubbleChart = {
  getNode: getNode,
  doubleScroll: doubleScroll
};

export default d3BubbleChart;
