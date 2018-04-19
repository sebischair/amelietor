import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import rd3 from 'react-d3-library';
import { Slider } from 'react-mdl';

import d3StackedBarChart from './d3StackedBarChart';
import s from './StackedBarChart.css';

const minYear = 2013;
const maxYear = 2017;
const defaultYear = 2017;
const defaultHeight = 500;
const defaultWidth = 960;

class StackedBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { d3: '', year: defaultYear };
  }

  componentDidMount() {
    this.setState({ d3: d3StackedBarChart.getNode(this.props.data, defaultHeight, defaultWidth) });
    this.applyTransition();
  }

  applyTransition = () => {
    let format = d3.format(',d');
    let div = d3
      .select('#barChart')
      .append('div')
      .attr('class', s.tooltip)
      .style('opacity', 0);

    d3
      .selectAll('.segment')
      .on('mouseover', function(d) {
        let value = d[1] - d[0];
        let segmentName = Object.keys(d.data).find(key => d.data[key] === value);
        div
          .transition()
          .duration(200)
          .style('opacity', 0.9);
        div.style('left', d3.select(this).attr('x') + 'px');
        div.style('top', d3.select(this).attr('y') + 'px');
        div.style('display', 'inline-block');
        div.html(segmentName + ': ' + format(value));
      })
      .on('mouseout', () => {
        div
          .transition()
          .duration(500)
          .style('opacity', 0);
      });

    let changeTabHandler = this.props.changeTabHandler;
    let viz = this.props.viz;
    d3.selectAll('.segment').on('click', d => {
      let segmentName = Object.keys(d.data).find(key => d.data[key] === d[1] - d[0]);
      changeTabHandler(4, viz, d.data.id, segmentName);
    });
  };

  redraw = event => {
    this.setState({
      d3: d3StackedBarChart.redraw(this.props.data, event.target.value, defaultHeight, defaultWidth),
      year: event.target.value
    });
  };

  render() {
    const RD3Component = rd3.Component;

    return (
      <div>
        <div className={`${s.barChart}`}>
          {this.state.d3 && <Slider min={minYear} max={maxYear} defaultValue={defaultYear} onChange={this.redraw} />}
          {this.state.year}
        </div>
        <div className={`${s.barChart}`} id="barChart">
          <svg id="barSvg" height={defaultHeight} width={defaultWidth} />
          {this.state.d3 && this.state.d3.length > 0 && <RD3Component data={this.state.d3} ref="barSvg" />}
        </div>
      </div>
    );
  }
}

StackedBarChart.propTypes = {
  changeTabHandler: PropTypes.func,
  data: PropTypes.array,
  viz: PropTypes.string
};

export default StackedBarChart;
