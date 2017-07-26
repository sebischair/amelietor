import React from 'react';
import rd3 from 'react-d3-library';
import d3BubbleChart from './d3BubbleChart';
import s from './BubbleChart.css';

class BubbleChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {d3: ''};
  }

  componentDidMount() {
    this.setState({d3: d3BubbleChart.getNode(this.props.data)});
  }

  render() {
    const RD3Component = rd3.Component;
    return (
      <div className={`${s.bubbleChart}`} ref="bubble">
        <svg height="640" width="960" className="bubble" id="svg" ></svg>
        {this.state.d3 && <RD3Component data={this.state.d3}/>}
      </div>
    );
  }
}

export default BubbleChart;
