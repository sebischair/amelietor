import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject, fetchAEData} from '../../core/actions/scactions';
import BubbleChart from '../BubbleChart/BubbleChart';
import {Spinner} from 'react-mdl';

class ArchitecturalElements extends React.Component {
  constructor(props) {
    super(props);
    let projectKey = this.props.projectKey === undefined ? HelperFunctions.getParameterByName("projectKey", history.location.search) : this.props.projectKey;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectKey));
    }

    if(this.props.aeData.length === 0) {
      this.props.dispatch(fetchAEData(projectKey));
    }
  }

  render() {
    return (
    <div>
      <div style={{'textAlign': 'center'}}>
        {this.props.aeData.length === 0 && <Spinner /> }
      </div>
      {this.props.aeData.length > 0 && <BubbleChart data={this.props.aeData} changeTabHandler={this.props.changeTabHandler} viz="ae" />}
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {selectedProject, aeData} = state.screcs;
  return {selectedProject, aeData};
};

ArchitecturalElements.propTypes = {
  aeData: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ArchitecturalElements);
