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
    let projectId = this.props.projectId === undefined ? HelperFunctions.getParameterByName("id", history.location.search) : this.props.projectId;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectId));
    }

    if (this.props.emData.length === 0) {
      this.props.dispatch(fetchEMData(projectId));
    }
  }

  componentDidMount() {
    //TODO: This is not invoked. Check the cause and resolve it.
    //d3HeatMap.doubleScroll(document.getElementById('hmap'));
  }

  render() {
    return (
      <div>
        <div style={{'textAlign': 'center'}}>
          {this.props.emData.length === 0 && <Spinner /> }
        </div>
        {this.props.emData.length > 0 && <div id='hmap'><HeatMap data={this.props.emData}/></div>}
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
