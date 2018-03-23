import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import rd3 from 'react-d3-library';
import { Slider } from 'react-mdl';

import d3BubbleChart from './d3BubbleChart';
import s from './BubbleChart.css';

const minYear = 2013;
const maxYear = 2017;
const defaultYear = 2017;
const defaultHeight = 640;
const defaultWidth = 960;

class BubbleChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = { d3: '', year: defaultYear };
  }

  componentDidMount() {
    let changeTabHandler = this.props.changeTabHandler;
    let viz = this.props.viz;
    this.setState({ d3: d3BubbleChart.getNode(this.props.data) });
    d3.selectAll('circle').on('click', d => {
      changeTabHandler(4, viz, d.id, 'default');
    });
  }

  redraw = event => {
    this.setState({ d3: d3BubbleChart.redraw(this.props.data, event.target.value), year: event.target.value });
  };

  render() {
    const RD3Component = rd3.Component;

    return (
      <div>
        <div className={`${s.bubbleChart}`}>
          {this.state.d3 && <Slider min={minYear} max={maxYear} defaultValue={defaultYear} onChange={this.redraw} />}
          {this.state.year}
        </div>
        <div className={`${s.bubbleChart}`}>
          <svg height={defaultHeight} width={defaultWidth} className="bubble" id="svg" />
          {this.state.d3 && <RD3Component data={this.state.d3} />}
        </div>
      </div>
    );
  }
}

BubbleChart.propTypes = {
  data: PropTypes.array.isRequired,
  changeTabHandler: PropTypes.func,
  viz: PropTypes.string
};

export default BubbleChart;
