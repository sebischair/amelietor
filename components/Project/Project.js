import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Card, CardTitle, CardText, CardActions, Tabs, Tab, Button, Grid, Cell, Spinner, Icon} from 'react-mdl';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject, postTo, getFrom, putTo} from '../../core/actions/scactions';
import QualityAttributes from '../QualityAttributes';
import ArchitecturalElements from '../ArchitecturalElements';
import ExpertiseMatrix from '../ExpertiseMatrix';
import Experts from '../Experts';
import DesignDecisions from '../DesignDecisions';
import s from './Project.css';

const config = require('../../tools/config');



class Project extends React.Component {
  constructor(props) {
    super(props);
    let tabNum = 0;
    switch (this.props.tab) {
      case "qa": tabNum = 0; break;
      case "ae": tabNum = 1; break;
      case "em": tabNum = 2; break;
      case "er": tabNum = 3; break;
      case "dd": tabNum = 4; break;
      default: tabNum = 0;
    }
    let projectId = this.props.id;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectId));
    }
    this.state = {activeTab: tabNum, viz: "default", attrName: "default", segmentName: "default", pipelineStatus: "", pipelineExeId: "", wait: false, isExtractionComplete: false};
    this.changeTabHandler = this.changeTabHandler.bind(this);
  }

  changeTabHandler = (tabNo, viz, d, segName) => {
      this.setState({activeTab: tabNo, viz: viz, attrName: d, segmentName: segName});
  };

  importProject = () => {
    this.setState({wait: true});
    let syncPipesConfig = {
      "config": {
        "url": config.jiraHost,
        "project": this.props.selectedProject.key,
        "username": config.jiraUserName,
        "password": config.jiraPassword
      },
      "name": "Extract issues from jira - " + this.props.selectedProject.name
    };

    let syncPipesPipeline = {
      "name": "Issues into to SC - " + this.props.selectedProject.name,
      "loaderConfig": "5968d71444fb3c1fa464b76b",
      "mapping": "576937cbaa9cb6f8325b9b2b"
    };

    postTo(config.syncPipesServer + "services/jiraIssueExtractor/configs", syncPipesConfig).then(response => response.json()).then((configData) => {
      syncPipesPipeline.extractorConfig = configData._id;
      postTo(config.syncPipesServer + "pipelines", syncPipesPipeline).then(response => response.json()).then((pipelineData) => {
        this.state.pipelineId = pipelineData._id;
        postTo(config.syncPipesServer + "pipelines/"+ pipelineData._id +"/actions/execute", {}).then(response => response.json()).then((statusData) => {
          this.setState({pipelineStatus: statusData.status, pipelineExeId: statusData._id, wait: false});
        });
      });
    });
  };

  extractMetaInformation = () => {
    this.setState({wait: true});

    let scProjectEntity = {"attributes": [ {"values": [ true ], "name": "isPreProcessed"}]};

    getFrom(config.akreServer + "labelDesignDecisions?projectId=" + this.props.selectedProject.projectId).then(response => response.json()).then(labelStatus => {
      getFrom(config.akreServer + "updateTaskWithQA?projectId=" + this.props.selectedProject.projectId).then(response => response.json()).then(qaStatus => {
        getFrom(config.akreServer + "updateTaskWithAE?projectId=" + this.props.selectedProject.projectId).then(response => response.json()).then(aeStatus => {
          putTo(config.scHost + "entities/" + this.props.selectedProject.projectId, scProjectEntity).then(response => response.json()).then(finalStatus => {
            this.setState({wait: false, isExtractionComplete: true});
          });
        });
      })
    })
  };

  render() {
    let actionsView = null;
    if(this.props.selectedProject.issuesCount > 0 && this.props.selectedProject.designDecisionCount > 0) {
      actionsView =
        <CardActions border>
        <Tabs activeTab={this.state.activeTab}  onChange={(tabId) => this.changeTabHandler(tabId, "default", "default", "default")} ripple>
          <Tab>Quality Attributes</Tab>
          <Tab>Architectural Elements</Tab>
          <Tab>Expertise Matrix</Tab>
          <Tab>Expert Recommender</Tab>
          <Tab>Design Decisions</Tab>
        </Tabs>
        <section>
          <br />
          <div className="content">
            {this.state.activeTab === 0 && <QualityAttributes projectId={this.props.selectedProject.projectId} changeTabHandler={this.changeTabHandler}/> }
            {this.state.activeTab === 1 && <ArchitecturalElements projectId={this.props.selectedProject.projectId} changeTabHandler={this.changeTabHandler}/> }
            {this.state.activeTab === 2 && <ExpertiseMatrix projectId={this.props.selectedProject.projectId}/> }
            {this.state.activeTab === 3 && <Experts projectId={this.props.selectedProject.projectId}/> }
            {this.state.activeTab === 4 && <DesignDecisions projectId={this.props.selectedProject.projectId} viz={this.state.viz} attrName={this.state.attrName} segmentName={this.state.segmentName}/> }
          </div>
        </section>
      </CardActions>
    } else {
      actionsView =
        <CardActions border>
          <section>
            <br />
            <div className="content">
              {this.props.selectedProject.issuesCount === 0 && <div><b>Step 1.</b> Import this project using <Button raised accent ripple onClick={this.importProject}> SyncPipes </Button></div> }
              {this.props.selectedProject.issuesCount === 0 && this.state.pipelineStatus === "Queued" && <div><b>Step 1.1.</b> View import status <a target="_blank" href = {config.syncPipesClient+ "pipeline-executions/" + this.state.pipelineExeId} >here</a></div>}
              {this.props.selectedProject.issuesCount > 0 && this.props.selectedProject.designDecisionCount == 0 && !this.props.selectedProject.isPreProcessed && <div>
                <div><b>Step 1.</b> Import this project using SyncPipes <Icon name="check" /></div>
                <div>
                  { !this.state.isExtractionComplete && <div><b>Step 2.</b> Prepare data for analysis <Button raised accent ripple onClick={this.extractMetaInformation}>Extract meta-information</Button></div> }
                  {this.state.isExtractionComplete && <div><b>Step 2.</b> Prepare data for analysis <Icon name="check" /> <br /> <b>Please reload the page!</b></div>}
                </div>
              </div>}
              {this.props.selectedProject.issuesCount > 0 && this.props.selectedProject.designDecisionCount == 0 && this.props.selectedProject.isPreProcessed &&
              <div><h3>This project does not contain any design decisions! </h3></div>}

            </div>
          </section>
        </CardActions>
    }

    return (
      <div>
        <Card shadow={0} style={{width: 'auto', height: 'auto', margin: 'auto', overflow: 'auto'}}>
          <CardTitle expand>{ this.props.selectedProject.name }</CardTitle>
          <CardText className={`${s.customCardText}`} >
            <Grid>
              <Cell col={10}>
                  { this.props.selectedProject.description }
              </Cell>
              <Cell col={2} >
                <div>
                  Issues: <b>{ this.props.selectedProject.issuesCount }</b> <br />
                  Design Decisions: <b>{ this.props.selectedProject.designDecisionCount }</b>
                </div>
              </Cell>
            </Grid>
          </CardText>
          <div style={{'textAlign': 'center'}}>
            {this.state.wait && <Spinner /> }
          </div>
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
