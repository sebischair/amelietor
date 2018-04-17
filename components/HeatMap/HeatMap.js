import React, { PropTypes } from 'react';
import rd3 from 'react-d3-library';
import TextField from 'material-ui/TextField';

import d3HeatMap from './d3HeatMap';
import s from './HeatMap.css';

class HeatMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { d3: '', searchString: '' };
  }

  componentDidMount() {
    this.setState({ d3: d3HeatMap.getNode(this.props.data) });
  }

  handleChange = event => {
    let ss = event.target.value.trim().toLowerCase();
    if (ss.length > 0) {
      let emData = this.props.data.filter(
        d => d.conceptName.toLowerCase().indexOf(ss) !== -1 || d.personName.toLowerCase().indexOf(ss) !== -1
      );
      this.setState({ d3: d3HeatMap.getNode(emData), searchString: ss });
    } else {
      this.setState({ d3: d3HeatMap.getNode(this.props.data), searchString: ss });
    }
  };

  render() {
    const RD3Component = rd3.Component;

    return (
      <div className={`${s.heatMap}`}>
        {this.props.data.length > 0 && (
          <div>
            <div>
              <TextField
                id="searchEMData"
                value={this.state.searchString}
                onChange={this.handleChange}
                label="Search for expert name or architectural element..."
                className={s.searchField}
              />
              <br />
              <br />
            </div>
            <div>
              <svg id="heatMap" />
              {this.state.d3 && <RD3Component data={this.state.d3} />}
            </div>
          </div>
        )}
      </div>
    );
  }
}

HeatMap.propTypes = {
  data: PropTypes.array.isRequired
};

export default HeatMap;
