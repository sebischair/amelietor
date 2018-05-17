import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardText, CardActions, Tabs, Tab, Button, Spinner, Icon } from 'react-mdl';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Collapse from 'material-ui/transitions/Collapse';

import { fetchSelctedProject, postTo, getFrom } from '../../core/actions/scactions';
import QualityAttributes from '../QualityAttributes';
import ArchitecturalElements from '../ArchitecturalElements';
import ExpertiseMatrix from '../ExpertiseMatrix';
import Experts from '../Experts';
import DesignDecisions from '../DesignDecisions';
import Breadcrumb from '../Breadcrumb';
import s from './Project.css';

const config = require('../../tools/config');
const syncPipesClient = process.env.SYNCPIPESCLIENT;
const AKRESERVER = process.env.AKRESERVER || 'http://localhost:9000/';

const styles = {
  infoButton: {
    fontSize: '0.875rem'
  },
  gridContainer: {
    margin: '0 16px 16px 16px'
  },
};

class Project extends React.Component {
  constructor(props) {
    super(props);
    let tabNum = 0;
    switch (this.props.tab) {
      case 'qa':
        tabNum = 0;
        break;
      case 'ae':
        tabNum = 1;
        break;
      case 'em':
        tabNum = 2;
        break;
      case 'er':
        tabNum = 3;
        break;
      case 'dd':
        tabNum = 4;
        break;
      default:
        tabNum = 0;
    }
    let projectKey = this.props.projectKey;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectKey));
    }
    this.state = {
      activeTab: tabNum,
      viz: 'default',
      attrName: 'default',
      segmentName: 'default',
      pipelineStatus: '',
      pipelineExeId: '',
      wait: false,
      isExtractionComplete: false,
      open: false
    };
  }

  changeTabHandler = (tabNo, viz, d, segName) => {
    const newState = { activeTab: tabNo, viz: viz, attrName: d, segmentName: segName };
    this.setState(newState);
    switch (tabNo) {
      case 0:
        history.pushState(newState, 'Quality attributes', 'qa');
        break;
      case 1:
        history.pushState(newState, 'Architectural elements', 'ae');
        break;
      case 2:
        history.pushState(newState, 'Expertise matrix', 'em');
        break;
      case 3:
        history.pushState(newState, 'Expert recommender', 'er');
        break;
      case 4:
        history.pushState(newState, 'Design decisions', 'dd');
        break;
      default:
        history.pushState(newState, 'Quality attributes', 'qa');
        break;
    }
  };

  importProject = () => {
    this.setState({ wait: true });
    let syncPipesServer = process.env.syncPipesServer || 'http://localhost:3010/api/v1/';
    let syncPipesConfig = {
      config: {
        url: process.env.JIRAHOST || "issues.apache.org/jira",
        project: this.props.selectedProject.key,
        username: process.env.JIRAUSERNAME,
        password: process.env.JIRAPASSWORD
      },
      name: 'Extract issues from jira - ' + this.props.selectedProject.name
    };

    let syncPipesPipeline = {
      name: 'Issues into to SC - ' + this.props.selectedProject.name,
      loaderConfig: process.env.SYNCPIPESISSUELOADERCONFIG || '5a16d383d64ce21f30047c19',
      extractorConfig: process.env.SYNCPIPESISSUEEXTRACTORCONFIG || '5968d6e444fb3c1fa464b76a',
      mapping: process.env.SYNCPIPESISSUEMAPPING || '5a214e6903c07826f09d1025'
    };

    let syncPipesJiraIssueImporterConfig = process.env.SYNCPIPESJIRAISSUEIMPORTERCONFIG || 'services/jiraIssueExtractor/configs';
    postTo(syncPipesServer + syncPipesJiraIssueImporterConfig, syncPipesConfig)
      .then(response => response.json())
      .then(configData => {
        syncPipesPipeline.extractorConfig = configData._id;
        postTo(syncPipesServer + 'pipelines', syncPipesPipeline)
          .then(response => response.json())
          .then(pipelineData => {
            this.state.pipelineId = pipelineData._id;
            postTo(syncPipesServer + 'pipelines/' + pipelineData._id + '/actions/execute', {})
              .then(response => response.json())
              .then(statusData => {
                this.setState({ pipelineStatus: statusData.status, pipelineExeId: statusData._id, wait: false });
              });
          });
      });
  };

  updateProjectIssueCount = () => {
    getFrom(AKRESERVER + 'updateProjectIssueCount?projectKey=' + this.props.selectedProject.key)
      .then(response => response.json())
      .then(status => {
        this.props.dispatch(fetchSelctedProject(this.props.selectedProject.key));
        this.setState({ wait: false });
      });
  };

  extractMetaInformation = () => {
    this.setState({ wait: true });
    getFrom(AKRESERVER + 'labelDesignDecisions?projectKey=' + this.props.selectedProject.key)
      .then(response => response.json())
      .then(labelStatus => {
        getFrom(AKRESERVER + 'updateTaskWithQA?projectKey=' + this.props.selectedProject.key)
          .then(response => response.json())
          .then(qaStatus => {
            getFrom(AKRESERVER + 'updateTaskWithAE?projectKey=' + this.props.selectedProject.key)
              .then(response => response.json())
              .then(aeStatus => {
                getFrom(AKRESERVER + 'updateProjectProcessState?projectKey=' + this.props.selectedProject.key)
                  .then(response => response.json())
                  .then(finalStatus => {
                    this.setState({ wait: false, isExtractionComplete: true });
                  });
              });
          });
      });
  };

  toggleInfo = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    let actionsView = null;
    if (this.props.selectedProject.issuesCount > 0 && this.props.selectedProject.decisionCount > 0) {
      actionsView = (
        <CardActions border>
          <Tabs
            activeTab={this.state.activeTab}
            onChange={tabId => this.changeTabHandler(tabId, 'default', 'default', 'default')}
            ripple
          >
            <Tab>Quality Attributes</Tab>
            <Tab>Architectural Elements</Tab>
            <Tab>Expertise Matrix</Tab>
            <Tab>Expert Recommender</Tab>
            <Tab>Design Decisions</Tab>
          </Tabs>
          <section>
            <br />
            <div className="content">
              {this.state.activeTab === 0 && (
                <QualityAttributes
                  projectKey={this.props.selectedProject.key}
                  changeTabHandler={this.changeTabHandler}
                />
              )}
              {this.state.activeTab === 1 && (
                <ArchitecturalElements
                  projectKey={this.props.selectedProject.key}
                  changeTabHandler={this.changeTabHandler}
                />
              )}
              {this.state.activeTab === 2 && <ExpertiseMatrix projectKey={this.props.selectedProject.key} />}
              {this.state.activeTab === 3 && <Experts projectKey={this.props.selectedProject.key} />}
              {this.state.activeTab === 4 && (
                <DesignDecisions
                  projectKey={this.props.selectedProject.key}
                  viz={this.state.viz}
                  attrName={this.state.attrName}
                  segmentName={this.state.segmentName}
                />
              )}
            </div>
          </section>
        </CardActions>
      );
    } else {
      actionsView = (
        <CardActions border>
          <section>
            <br />
            <div className="content">
              {this.props.selectedProject.issuesCount === 0 && (
                <div>
                  <b>Step 1.</b> Import this project using{' '}
                  <Button raised accent ripple onClick={this.importProject}>
                    {' '}
                    SyncPipes{' '}
                  </Button>
                </div>
              )}
              {this.props.selectedProject.issuesCount === 0 &&
                this.state.pipelineStatus === 'Queued' && (
                  <div>
                    <b>Step 1.1.</b> View import status{' '}
                    <a
                      target="_blank"
                      href={syncPipesClient + 'pipeline-executions/' + this.state.pipelineExeId}
                    >
                      here
                    </a>{' '}
                    async &&{' '}
                    <Button raised accent ripple onClick={this.updateProjectIssueCount}>
                      Update issues count in project
                    </Button>{' '}
                  </div>
                )}
              {this.props.selectedProject.issuesCount > 0 &&
                this.props.selectedProject.decisionCount == 0 &&
                !this.props.selectedProject.preProcessed && (
                  <div>
                    <div>
                      <b>Step 1.</b> Import this project using SyncPipes <Icon name="check" />
                    </div>
                    <div>
                      {!this.state.isExtractionComplete && (
                        <div>
                          <b>Step 2.</b> Prepare data for analysis{' '}
                          <Button raised accent ripple onClick={this.extractMetaInformation}>
                            Extract meta-information
                          </Button>
                        </div>
                      )}
                      {this.state.isExtractionComplete && (
                        <div>
                          <b>Step 2.</b> Prepare data for analysis <Icon name="check" /> <br />{' '}
                          <b>Please reload the page!</b>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              {this.props.selectedProject.issuesCount > 0 &&
                this.props.selectedProject.decisionCount == 0 &&
                this.props.selectedProject.preProcessed && (
                  <div>
                    <h3>This project does not contain any design decisions! </h3>
                  </div>
                )}
            </div>
          </section>
        </CardActions>
      );
    }

    //  Breadcrumb navigation
    const breadcrumbs = [
      { url: '/', label: 'Home' },
      { url: '/projects', label: 'Projects' },
      { label: this.props.selectedProject.name }
    ];

    return (
      <div className={s.project}>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <Card shadow={0} className={s.customCard}>
          <CardTitle expand>
            {this.props.selectedProject.name} &nbsp;
            <a href="#" onClick={this.toggleInfo} className={this.props.classes.infoButton}>
              {this.state.open ? 'Show less' : 'Show more'}
            </a>
          </CardTitle>
          <CardText className={s.customCardText}>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <Grid container className={this.props.classes.gridContainer}>
                <Grid item xs={10}>{this.props.selectedProject.description}</Grid>
                <Grid item xs={2}>
                  <div>
                    Issues: <b>{this.props.selectedProject.issuesCount}</b> <br />
                    Design Decisions: <b>{this.props.selectedProject.decisionCount}</b>
                  </div>
                </Grid>
              </Grid>
            </Collapse>
          </CardText>
          <div style={{ textAlign: 'center' }}>{this.state.wait && <Spinner />}</div>
          {actionsView}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedProject } = state.screcs;
  return { selectedProject };
};

Project.propTypes = {
  projectKey: PropTypes.string,
  selectedProject: PropTypes.object,
  tab: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default connect(mapStateToProps)(withStyles(styles)(Project));
