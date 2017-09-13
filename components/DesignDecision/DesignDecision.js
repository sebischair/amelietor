import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Card, CardTitle, CardText, CardActions, Tabs, Tab, Button, FABButton, Icon, Grid, Cell} from 'react-mdl';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject, fetchSelctedDD} from '../../core/actions/scactions';
import Amelietor from '../Amelietor'
import {receiveFileContent} from '../../core/actions/actions';
import s from './DesignDecision.css';
import TokenManager from "../TokenManager";
import RecContainer from "../RecContainer";

class DesignDecision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projectId: "", ddId: ""};

    this.state.projectId = HelperFunctions.getParameterByName("projectId", history.location.search);
    this.state.ddId = HelperFunctions.getParameterByName("id", history.location.search);

    if (Object.keys(this.props.selectedDD).length === 0 && this.props.selectedDD.constructor === Object) {
      this.props.dispatch(fetchSelctedDD(this.state.ddId));
    }

    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectId));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDD.hasOwnProperty("description") && nextProps.selectedProject.hasOwnProperty("projectId")) {
      this.props.dispatch(receiveFileContent(null, [nextProps.selectedDD.description], true));
    }
  }


  onBackArrow = () => {
    history.push({
      pathname: '/recommender',
      search: '?id=' + this.state.projectId
    });
  };

  render() {
    return (
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--8-col">
              <h2>{ this.props.selectedDD.summary}</h2>
              <Amelietor triggerOnLoad={true} />
            </div>
            <div className={`mdl-cell mdl-cell--4-col ${s.recommendations}`}>
              <TokenManager/>
              <br/>
              <RecContainer />
            </div>
          </div>
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
