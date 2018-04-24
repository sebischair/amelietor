import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';

import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import HeatMap from '../HeatMap/HeatMap';
import { fetchSelctedProject, fetchEMData } from '../../core/actions/scactions';
import s from './ExpertiseMatrix.css';

class ExpertiseMatrix extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectKey: this.props.projectKey,
      searchString: ''
    };

    if (this.props.projectKey === undefined) {
      this.setState({ projectKey: HelperFunctions.getParameterByName('projectKey', history.location.search) });
    }
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectKey));
    }
    if (this.props.emData.length === 0) {
      this.props.dispatch(fetchEMData(this.state.projectKey));
    }
  }

  render() {
    let emData = this.props.emData;

    //TODO: Unable to reload the component
    return (
      <div>
        {this.props.emData.length === 0 && (
          <div className={s.circularProgress}>
            <CircularProgress />
            <br />
            <br />
          </div>
        )}
        {emData.length > 0 && (
          <div>
            <HeatMap data={emData} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedProject, emData } = state.screcs;
  return { selectedProject, emData };
};

ExpertiseMatrix.propTypes = {
  projectKey: PropTypes.string,
  selectedProject: PropTypes.object,
  changeTabHandler: PropTypes.func,
  emData: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ExpertiseMatrix);
