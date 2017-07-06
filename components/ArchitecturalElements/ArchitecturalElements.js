import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject} from '../../core/actions/scactions';
import BubbleChart from '../BubbleChart/BubbleChart';
import aeData from './data.json';

class ArchitecturalElements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {data: aeData};
    let projectId = this.props.projectId === undefined ? HelperFunctions.getParameterByName("id", history.location.search) : this.props.projectId;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectId));
    }
  }

  render() {
    return (
      <BubbleChart data={this.state.data}/>
    );
  }
}

const mapStateToProps = (state) => {
  const {selectedProject} = state.screcs;
  return {selectedProject};
};

ArchitecturalElements.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ArchitecturalElements);
