import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';

import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import { fetchSelctedProject, fetchQAData } from '../../core/actions/scactions';
import StackedBarChart from '../StackedBarChart/StackedBarChart';
import s from './QualityAttributes.css';

class QualityAttributes extends React.Component {
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
    if (this.props.qaData.length === 0) {
      this.props.dispatch(fetchQAData(this.state.projectKey));
    }
  }

  render() {
    let emptyDDList = '';
    if (this.props.qaData.length > 0) {
      emptyDDList = (
        <div className="mdl-card__supporting-text">
          <b>Missing Quality Attributes</b>
          <ul>
            {this.props.qaData.map(qa => {
              if (qa.value.reduce((a, b) => a + b, 0) == 0) {
                return <li key={qa.id}> {qa.id} </li>;
              }
            })}
          </ul>
        </div>
      );
    }

    return (
      <div>
        {this.props.qaData.length === 0 && (
          <div className={s.circularProgress}>
            <CircularProgress />
            <br />
            <br />
          </div>
        )}
        <Grid container>
          <Grid item xs={10}>
            <div>
              {this.props.qaData.length > 0 && (
                <StackedBarChart data={this.props.qaData} changeTabHandler={this.props.changeTabHandler} viz="qa" />
              )}
            </div>
          </Grid>
          <Grid item xs={2}>
            {emptyDDList}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedProject, qaData } = state.screcs;
  return { selectedProject, qaData };
};

QualityAttributes.propTypes = {
  projectKey: PropTypes.string,
  selectedProject: PropTypes.object,
  changeTabHandler: PropTypes.func,
  qaData: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(QualityAttributes);
