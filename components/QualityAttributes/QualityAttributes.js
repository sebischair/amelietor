import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject, fetchQAData} from '../../core/actions/scactions';
import StackedBarChart from '../StackedBarChart/StackedBarChart';
import {Spinner, Grid, Cell} from 'react-mdl';

class QualityAttributes extends React.Component {
  constructor(props) {
    super(props);
    let projectId = this.props.projectId === undefined ? HelperFunctions.getParameterByName("id", history.location.search) : this.props.projectId;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectId));
    }

    if (this.props.qaData.length === 0) {
      this.props.dispatch(fetchQAData(projectId));
    }
  }

  render() {
    let emptyDDList = "";
    if(this.props.qaData.length > 0) {
      emptyDDList = <div className="mdl-card__supporting-text">
          <b>Missing Quality Attributes</b>
          {
            this.props.qaData.map(qa => {
              if (qa.value.reduce((a, b) => a + b, 0) == 0) {
                return <div key={qa.id}> {qa.id} </div>
              }
            })
          }
      </div>
    }

    return (
      <Grid>
        <Cell col={10}>
          <div>
            <div style={{'textAlign': 'center'}}>
              {this.props.qaData.length === 0 && <Spinner /> }
            </div>
            {this.props.qaData.length > 0 && <StackedBarChart data={this.props.qaData} changeTabHandler={this.props.changeTabHandler} viz="qa"/>}
          </div>
        </Cell>
        <Cell col={2}>
          {emptyDDList}
        </Cell>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  const {selectedProject, qaData} = state.screcs;
  return {selectedProject, qaData};
};

QualityAttributes.propTypes = {
  qaData: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(QualityAttributes);
