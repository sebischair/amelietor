import React from 'react';

import rd3 from 'react-d3-library';
import d3StackedBarChart from './d3StackedBarChart';
import s from './StackedBarChart.css';
import {Slider, Grid, Cell} from 'react-mdl';
import * as d3 from 'd3';

class StackedBarChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {d3: '', year: 2017};
  }

  componentDidMount() {
    this.setState({d3: d3StackedBarChart.getNode(this.props.data)});
    this.applyTransition();
  }

  applyTransition = () => {
    let format = d3.format(",d");
    let div = d3.select("#barChart").append("div").attr("class", s.tooltip).style("opacity", 0);

    d3.selectAll('.bar').on("mouseover", function(d) {
      div.transition().duration(200).style("opacity", .9);
      div.style("left", d3.select(this).attr("x") +"px");
      div.style("top", d3.select(this).attr("y") +"px");
      div.style("display", "inline-block");
      div.html(d.id + ": " + format(d.value));
    }).on('mouseout', () => {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

    let changeTabHandler = this.props.changeTabHandler;
    let viz = this.props.viz;
    d3.selectAll('.segment').on("click", (d) => {
      let segmentName = Object.keys(d.data).find(key => d.data[key] === (d[1]-d[0]));
      changeTabHandler(4, viz, d.data.id, segmentName);
    });

  };

  redraw = (event) => {
    this.setState({d3: d3StackedBarChart.redraw(this.props.data, event.target.value), year: event.target.value});
  };

  render() {
    const RD3Component = rd3.Component;
    return (
      <Grid>
        <Cell col={12}>
          <div className={`${s.barChart}`}>
            {this.state.d3 && <Slider min={2013} max={2017} defaultValue={2017} onChange={this.redraw} />}
            {this.state.year}
          </div>
        </Cell>
        <Cell col={12}>
          <div className={`${s.barChart}`} id="barChart">
            <svg height="640" width="960"></svg>
            {this.state.d3 && this.state.d3.length > 0 && <RD3Component data={this.state.d3} ref="barSvg"/>}
          </div>
        </Cell>
      </Grid>
    );
  }
}

export default StackedBarChart;
