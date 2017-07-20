import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import HeatMap from '../HeatMap/HeatMap';
import {fetchSelctedProject, fetchEMData} from '../../core/actions/scactions';
import {Spinner, Textfield} from 'react-mdl';

class ExpertiseMatrix extends React.Component {
  constructor(props) {
    super(props);
    let projectId = this.props.projectId === undefined ? HelperFunctions.getParameterByName("id", history.location.search) : this.props.projectId;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectId));
    }

    if (this.props.emData.length === 0) {
      this.props.dispatch(fetchEMData(projectId));
    }
    this.state = {searchString: ""};
  }

  componentDidMount() {
    //TODO: This is not invoked. Check the cause and resolve it.
    //d3HeatMap.doubleScroll(document.getElementById('hmap'));
  }

  handleChange = (event) => {
    this.setState({searchString: event.target.value});
  };

  render() {
    let emData = this.props.emData;
    let searchString = this.state.searchString.trim().toLowerCase();
    if (searchString.length > 0) {
      emData = emData.filter(data => (data.conceptName.toLowerCase().indexOf(searchString) !== -1)
      || (data.personName.toLowerCase().indexOf(searchString) !== -1));
    }

    //TODO: Unable to reload the component
    return (
      <div>
        <Textfield id='searchEMData' value={this.state.searchString} onChange={this.handleChange} label="Search..."
                   style={{width: '400px'}}/>
        <div style={{'textAlign': 'center'}}>
          {emData.length === 0 && <Spinner /> }
        </div>
        {emData.length > 0 && <div id='hmap'><HeatMap data={emData}/></div>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {selectedProject, emData} = state.screcs;
  return {selectedProject, emData};
};

ExpertiseMatrix.propTypes = {
  emData: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ExpertiseMatrix);
