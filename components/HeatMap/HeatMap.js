import React from 'react';
import rd3 from 'react-d3-library';
import d3HeatMap from './d3HeatMap';
import s from './HeatMap.css';
import {Textfield, Grid, Cell} from 'react-mdl';

class HeatMap extends React.Component {

  constructor(props) {
    super(props);
    this.state = {d3: '', searchString: ''};
  }

  componentDidMount() {
    this.setState({d3: d3HeatMap.getNode(this.props.data)});
  }

  handleChange = (event) => {
    let ss = event.target.value.trim().toLowerCase();
    console.log(ss);
    if (ss.length > 0) {
      let emData = this.props.data.filter(d => (d.conceptName.toLowerCase().indexOf(ss) !== -1) || (d.personName.toLowerCase().indexOf(ss) !== -1));
      this.setState({d3: d3HeatMap.getNode(emData), searchString: ss});
    } else {
      this.setState({d3: d3HeatMap.getNode(this.props.data), searchString: ss});
    }
  };

  render() {
    const RD3Component = rd3.Component;
    return (
      <div className={`${s.heatMap}`}>
        <Grid>
          <Cell col={12}>
            {this.props.data.length > 0 && <Textfield id='searchEMData' value={this.state.searchString} onChange={this.handleChange} label="Search..." style={{width: '400px'}}/>}
          </Cell>
          <Cell col={12}>
            <div>
              <svg id="heatMap"></svg>
              {this.state.d3 && <RD3Component data={this.state.d3}/>}
            </div>
          </Cell>
        </Grid>
      </div>
    );
  }
}

export default HeatMap;
