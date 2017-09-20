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
import EditorControls from "../EditorControls";

class DesignDecision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projectId: "", ddId: ""};

    this.state.projectId = this.props.projectId;
    this.state.ddId = this.props.id;
    this.state.summary = this.props.selectedDD.summary;
    this.rawContent = {
      blocks: [
        {
          text: (this.props.selectedDD.description || ''),
          type: 'unstyled',
        }
      ],
      entityMap: {
      }
    };
     
    if (Object.keys(this.props.selectedDD).length === 0 && this.props.selectedDD.constructor === Object) {
      this.props.dispatch(fetchSelctedDD(this.state.ddId));
    }

    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectId));
    }

    if (this.props.selectedDD.hasOwnProperty("description") && this.props.selectedProject.hasOwnProperty("projectId")) {
      this.props.dispatch(receiveFileContent(null, [this.props.selectedDD.description], true));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDD.hasOwnProperty("description") && nextProps.selectedProject.hasOwnProperty("projectId")) {
      this.props.dispatch(receiveFileContent(null, [nextProps.selectedDD.description], true));
      console.log(nextProps.selectedDD.summary);
      this.setState({summary:nextProps.selectedDD.summary})
    }
  }

  onBackArrow = () => {
    history.push({
      pathname: '/recommender/'+ this.state.projectId + '/dd'
    });
  };

  render() {
    return (
          <div className="mdl-grid">
            <div className="mdl-cell mdl-cell--8-col">
              <h3>{this.state.summary}</h3>
              <Amelietor triggerOnLoad={true} initialContent={this.rawContent} readOnly={true}/>
            </div>
            <div className={`mdl-cell mdl-cell--4-col ${s.recommendations}`}>
              <TokenManager/>
              <br/>
              <RecContainer />
            </div>
            <EditorControls />
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
