import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Card, CardTitle, CardText, CardActions, Tabs, Tab, Button, Grid, Cell} from 'react-mdl';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject} from '../../core/actions/scactions';
import QualityAttributes from '../QualityAttributes';
import ArchitecturalElements from '../ArchitecturalElements';
import ExpertiseMatrix from '../ExpertiseMatrix';
import Experts from '../Experts';
import DesignDecisions from '../DesignDecisions';

class Project extends React.Component {
  constructor(props) {
    super(props);
    let projectId = HelperFunctions.getParameterByName("id", history.location.search);
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectId));
    }
    this.state = {activeTab: 0};
  }

  render() {
    let actionsView = null;
    if(this.props.selectedProject.issuesCount > 0) {
      actionsView =
        <CardActions border>
        <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({activeTab: tabId})} ripple>
          <Tab>Quality Attributes</Tab>
          <Tab>Architectural Elements</Tab>
          <Tab>Expertise Matrix</Tab>
          <Tab>Expert Recommender</Tab>
          <Tab>Design Decisions</Tab>
        </Tabs>
        <section>
          <br />
          <div className="content">
            {this.state.activeTab === 0 && <QualityAttributes projectId={this.props.selectedProject.projectId}/> }
            {this.state.activeTab === 1 && <ArchitecturalElements projectId={this.props.selectedProject.projectId}/> }
            {this.state.activeTab === 2 && <ExpertiseMatrix projectId={this.props.selectedProject.projectId}/> }
            {this.state.activeTab === 3 && <Experts projectId={this.props.selectedProject.projectId}/> }
            {this.state.activeTab === 4 && <DesignDecisions projectId={this.props.selectedProject.projectId}/> }
          </div>
        </section>
      </CardActions>
    } else {
      actionsView =
        <CardActions border>
          <section>
            <br />
            <div className="content">
              Import this project using <Button raised accent ripple>Syncpipes</Button>
            </div>
          </section>
        </CardActions>
    }

    return (
      <div>
        <Card shadow={0} style={{width: 'auto', height: 'auto', margin: 'auto', overflow: 'auto'}}>
          <CardTitle expand style={{color: 'black'}}>{ this.props.selectedProject.name }</CardTitle>
          <Grid>
            <Cell col={10}>
              <CardText>
                { this.props.selectedProject.description }
              </CardText>
            </Cell>
            <Cell col={2}>
              <div className="mdl-card__supporting-text">
                Issues: <b>{ this.props.selectedProject.issuesCount }</b> <br />
                Design Decisions: <b>{ this.props.selectedProject.designDecisionCount }</b>
              </div>
            </Cell>
          </Grid>
          {actionsView}
        </Card>
      </div>
    );
  }
}

function getParameterByName(name, string) {
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(string);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const mapStateToProps = (state) => {
  const {projects, selectedProject} = state.screcs;
  return {projects, selectedProject};
};

Project.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Project);
