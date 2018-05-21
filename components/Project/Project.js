import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Card, CardTitle, CardText, CardActions, Tabs, Tab, Icon } from 'react-mdl';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Collapse from 'material-ui/transitions/Collapse';
import Stepper, { Step, StepLabel, StepContent } from 'material-ui/Stepper';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';

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

const styles = theme => ({
  infoButton: {
    fontSize: '0.875rem'
  },
  gridContainer: {
    margin: '0 16px 16px 16px'
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
    width: 'fit-content'
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -6,
    marginLeft: -16
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2
  },
  finishContainer: {
    padding: theme.spacing.unit * 3
  }
});

const steps = ['Import project', 'Process data for analysis'];

function getStepContent(step) {
  switch (step) {
    case 0:
      return 'Use SyncPipes to import this project.';
    case 1:
      return 'Extract meta-information about the project as well as issues.';
    default:
      return 'Unknown step';
  }
}

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
      loading: false,
      isExtractionComplete: false,
      open: false,
      activeStep: 0
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
    console.log('Start importing the project...');
    this.setState({ loading: true });
    let syncPipesServer = process.env.syncPipesServer || 'http://localhost:3010/api/v1/';
    let syncPipesConfig = {
      config: {
        url: process.env.JIRAHOST || 'issues.apache.org/jira',
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

    let syncPipesJiraIssueImporterConfig =
      process.env.SYNCPIPESJIRAISSUEIMPORTERCONFIG || 'services/jiraIssueExtractor/configs';
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
                this.setState({
                  pipelineStatus: statusData.status,
                  pipelineExeId: statusData._id,
                  loading: false,
                  activeStep: this.state.activeStep + 1
                });
              });
          });
      });
  };

  updateProjectIssueCount = () => {
    getFrom(AKRESERVER + 'updateProjectIssueCount?projectKey=' + this.props.selectedProject.key)
      .then(response => response.json())
      .then(status => {
        this.props.dispatch(fetchSelctedProject(this.props.selectedProject.key));
        this.setState({ loading: false });
      });
  };

  extractMetaInformation = () => {
    console.log('Start extracting meta-information...');
    this.setState({ loading: true });
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
                    this.setState({
                      loading: false,
                      isExtractionComplete: true,
                      activeStep: this.state.activeStep + 1
                    });
                  });
              });
          });
      });
  };

  toggleInfo = () => {
    this.setState({ open: !this.state.open });
  };

  // TODO: remove mock
  mockImport = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        loading: false,
        activeStep: this.state.activeStep + 1
      });
    }, 2000);
  };

  render() {
    let actionsView = null;
    const { selectedProject, classes } = this.props;
    const {
      activeTab,
      viz,
      attrName,
      segmentName,
      pipelineStatus,
      pipelineExeId,
      isExtractionComplete,
      activeStep,
      loading
    } = this.state;

    if (selectedProject.issuesCount > 0 && selectedProject.decisionCount > 0) {
      actionsView = (
        <CardActions border>
          <Tabs
            activeTab={activeTab}
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
              {activeTab === 0 && (
                <QualityAttributes projectKey={selectedProject.key} changeTabHandler={this.changeTabHandler} />
              )}
              {activeTab === 1 && (
                <ArchitecturalElements projectKey={selectedProject.key} changeTabHandler={this.changeTabHandler} />
              )}
              {activeTab === 2 && <ExpertiseMatrix projectKey={selectedProject.key} />}
              {activeTab === 3 && <Experts projectKey={selectedProject.key} />}
              {activeTab === 4 && (
                <DesignDecisions
                  projectKey={selectedProject.key}
                  viz={viz}
                  attrName={attrName}
                  segmentName={segmentName}
                />
              )}
            </div>
          </section>
        </CardActions>
      );
    } else {
      actionsView = (
        <div>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>{steps[0]}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(0)}</Typography>
                <div className={classes.actionsContainer}>
                  <div className={classes.wrapper}>
                    <Button
                      className={classes.button}
                      variant="raised"
                      color="primary"
                      // TODO: remove mock
                      onClick={this.importProject}
                      // onClick={this.mockImport}
                      disabled={loading}
                    >
                      Import
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </div>
                </div>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>{steps[1]}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(1)}</Typography>
                <div className={classes.actionsContainer}>
                  <div className={classes.wrapper}>
                    <Button
                      className={classes.button}
                      variant="raised"
                      color="primary"
                      // TODO: remove mock
                      onClick={this.extractMetaInformation}
                      // onClick={this.mockImport}
                      disabled={loading}
                    >
                      Process
                    </Button>
                    {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  </div>
                </div>
              </StepContent>
            </Step>
          </Stepper>
          {activeStep === steps.length && (
            <Paper square elevation={0} className={classes.finishContainer}>
              <Typography>
                Project is successfully imported. &nbsp;
                <a href="javascript:window.location.reload(true)">View your project.</a>
              </Typography>
            </Paper>
          )}
        </div>
        // <CardActions border>
        //   <section>
        //     <br />
        //     <div className="content">
        //       {selectedProject.issuesCount === 0 && (
        //         <div>
        //           <b>Step 1.</b> Import this project using
        //           <Button raised accent ripple onClick={this.importProject}>
        //             SyncPipes
        //           </Button>
        //         </div>
        //       )}
        //       {selectedProject.issuesCount === 0 &&
        //         pipelineStatus === 'Queued' && (
        //           <div>
        //             <b>Step 1.1.</b> View import status
        //             <a target="_blank" href={syncPipesClient + 'pipeline-executions/' + pipelineExeId}>
        //               here
        //             </a>
        //             async &&
        //             <Button raised accent ripple onClick={this.updateProjectIssueCount}>
        //               Update issues count in project
        //             </Button>
        //           </div>
        //         )}
        //       {selectedProject.issuesCount > 0 &&
        //         selectedProject.decisionCount == 0 &&
        //         !selectedProject.preProcessed && (
        //           <div>
        //             <div>
        //               <b>Step 1.</b> Import this project using SyncPipes <Icon name="check" />
        //             </div>
        //             <div>
        //               {!isExtractionComplete && (
        //                 <div>
        //                   <b>Step 2.</b> Prepare data for analysis
        //                   <Button raised accent ripple onClick={this.extractMetaInformation}>
        //                     Extract meta-information
        //                   </Button>
        //                 </div>
        //               )}
        //               {isExtractionComplete && (
        //                 <div>
        //                   <b>Step 2.</b> Prepare data for analysis <Icon name="check" /> <br />
        //                   <b>Please reload the page!</b>
        //                 </div>
        //               )}
        //             </div>
        //           </div>
        //         )}
        //       {selectedProject.issuesCount > 0 &&
        //         selectedProject.decisionCount == 0 &&
        //         selectedProject.preProcessed && (
        //           <div>
        //             <h3>This project does not contain any design decisions! </h3>
        //           </div>
        //         )}
        //     </div>
        //   </section>
        // </CardActions>
      );
    }

    //  Breadcrumb navigation
    const breadcrumbs = [
      { url: '/', label: 'Home' },
      { url: '/projects', label: 'Projects' },
      { label: selectedProject.name }
    ];

    return (
      <div className={s.project}>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <Card shadow={0} className={s.customCard}>
          <CardTitle expand>
            {selectedProject.name} &nbsp;
            <a href="#" onClick={this.toggleInfo} className={this.props.classes.infoButton}>
              {this.state.open ? 'Show less' : 'Show more'}
            </a>
          </CardTitle>
          <CardText className={s.customCardText}>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
              <Grid container className={this.props.classes.gridContainer}>
                <Grid item xs={10}>
                  {selectedProject.description}
                </Grid>
                <Grid item xs={2}>
                  <div>
                    Issues: <b>{selectedProject.issuesCount}</b> <br />
                    Design Decisions: <b>{selectedProject.decisionCount}</b>
                  </div>
                </Grid>
              </Grid>
            </Collapse>
          </CardText>
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
