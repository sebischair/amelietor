import React from 'react';
import HeatMap from '../HeatMap/HeatMap';
import aeData from './data.json';

class ExpertiseMatrix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: aeData};
  }

  componentDidMount() {
    //TODO: This is not invoked. Check the cause and resolve it.
    //d3HeatMap.doubleScroll(document.getElementById('hmap'));
  }

  render() {
    return (
      <div id='hmap'><HeatMap data={this.state.data}/></div>
    );
  }
}

export default ExpertiseMatrix;
