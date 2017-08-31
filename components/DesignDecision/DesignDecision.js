import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject, fetchSelctedDD} from '../../core/actions/scactions';
import Amelietor from '../Amelietor/Amelietor'
import {receiveFileContent} from '../../core/actions/actions';

class DesignDecision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projectId: "", ddId: "", activeTab: 0};

    this.state.projectId = HelperFunctions.getParameterByName("projectId", history.location.search);
    this.state.ddId = HelperFunctions.getParameterByName("id", history.location.search);

    if (Object.keys(this.props.selectedDD).length === 0 && this.props.selectedDD.constructor === Object) {
      this.props.dispatch(fetchSelctedDD(this.state.ddId));
    }

    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectId));
    }
    this.props.dispatch(receiveFileContent(null, [this.props.selectedDD.description], true))
  }

  onBackArrow = () => {
      history.push({
        pathname: '/recommender',
        search: '?id=' + this.state.projectId
      });
  };

  render() {
    return (
      <Amelietor />
    );
  }
}

const mapStateToProps = (state) => {
  const {selectedDD, selectedProject} = state.screcs;
  return {selectedDD, selectedProject};
};

DesignDecision.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(DesignDecision);
