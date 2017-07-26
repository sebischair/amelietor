import React from 'react';
import rd3 from 'react-d3-library';
import d3HeatMap from './d3HeatMap';
import s from './HeatMap.css';

class HeatMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {d3: ''};
  }

  componentDidMount() {
    this.setState({d3: d3HeatMap.getNode(this.props.data)});
  }

  render() {
    const RD3Component = rd3.Component;
    return (
      <div className={`${s.heatMap}`}>
        <svg id="heatMap"></svg>
        {this.state.d3 && <RD3Component data={this.state.d3}/>}
      </div>
    );
  }
}

export default HeatMap;
