import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import HeatMap from '../HeatMap/HeatMap';
import {fetchSelctedProject, fetchEMData} from '../../core/actions/scactions';
import {Spinner} from 'react-mdl';

class ExpertiseMatrix extends React.Component {
  constructor(props) {
    super(props);
    let projectKey = this.props.projectKey === undefined ? HelperFunctions.getParameterByName("projectKey", history.location.search) : this.props.projectKey;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectKey));
    }

    if (this.props.emData.length === 0) {
      this.props.dispatch(fetchEMData(projectKey));
    }
    this.state = {searchString: ""};
  }

  render() {
    let emData = this.props.emData;

    //TODO: Unable to reload the component
    return (
      <div>
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
