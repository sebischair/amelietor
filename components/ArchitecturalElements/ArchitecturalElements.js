import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';

import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import { fetchSelctedProject, fetchAEData } from '../../core/actions/scactions';
import BubbleChart from '../BubbleChart/BubbleChart';
import s from './ArchitecturalElements.css';

class ArchitecturalElements extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectKey: this.props.projectKey
    };

    if (this.props.projectKey === undefined) {
      this.setState({ projectKey: HelperFunctions.getParameterByName('projectKey', history.location.search) });
    }
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectKey));
    }
    if (this.props.aeData.length === 0) {
      this.props.dispatch(fetchAEData(this.state.projectKey));
    }
  }

  render() {
    return (
      <div>
        {this.props.aeData.length === 0 && (
          <div className={s.circularProgress}>
            <CircularProgress />
            <br />
            <br />
          </div>
        )}
        {this.props.aeData.length > 0 && (
          <BubbleChart data={this.props.aeData} changeTabHandler={this.props.changeTabHandler} viz="ae" />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedProject, aeData } = state.screcs;
  return { selectedProject, aeData };
};

ArchitecturalElements.propTypes = {
  projectKey: PropTypes.string,
  selectedProject: PropTypes.object,
  changeTabHandler: PropTypes.func,
  aeData: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ArchitecturalElements);
