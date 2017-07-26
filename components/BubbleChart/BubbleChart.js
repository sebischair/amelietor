import React from 'react';
import rd3 from 'react-d3-library';
import d3BubbleChart from './d3BubbleChart';
import s from './BubbleChart.css';
import {Slider, Grid, Cell} from 'react-mdl';

class BubbleChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {d3: '', year: 2017};
  }

  componentDidMount() {
    this.setState({d3: d3BubbleChart.getNode(this.props.data)});
  }

  redraw = (event) => {

    this.setState({d3: d3BubbleChart.redraw(this.props.data, event.target.value), year: event.target.value});
  };

  render() {
    const RD3Component = rd3.Component;
    let year = this.state.year;
    return (
      <Grid>
        <Cell col={12}>
          <div className={`${s.bubbleChart}`}>
            {this.state.d3 && <Slider min={2013} max={2017} defaultValue={2017} onChange={this.redraw} />}
            {year}
          </div>
        </Cell>
        <Cell col={12}>
          <div className={`${s.bubbleChart}`}>
            <svg height="640" width="960" className="bubble" id="svg" ></svg>
            {this.state.d3 && <RD3Component data={this.state.d3}/>}
          </div>
        </Cell>
      </Grid>
    );
  }
}

export default BubbleChart;
