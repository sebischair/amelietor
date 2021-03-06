import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip';
import Help from 'material-ui-icons/Help';
import Joyride from 'react-joyride';
import disableScroll from 'disable-scroll';

import history from '../../src/history';
import Amelietor from '../Amelietor';
import TokenManager from '../TokenManager';
import RecContainer from '../RecContainer';
import EditorControls from '../EditorControls';
import SimilarDocuments from '../SimilarDocuments';
import { fetchSelctedProject, fetchSelctedDD } from '../../core/actions/scactions';
import { receiveFileContent } from '../../core/actions/actions';
import Breadcrumb from '../Breadcrumb';
import s from './DesignDecision.css';

const tourSteps = [
  {
    title: 'Similar decisions',
    text: 'This tables shows similar design decisions made in the past.',
    selector: '.similar-documents',
    position: 'bottom',
    type: 'hover',
    isFixed: true
  }
];

const styles = {
  gridContainer: {
    margin: '16px'
  },
  helpIcon: {
    fontSize: '16px',
    color: 'grey'
  }
};

class DesignDecision extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.state = {
      projectKey: this.props.projectKey,
      issueKey: this.props.issueKey,
      summary: this.props.selectedDD.summary,
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isRunning: false,
      stepIndex: 0,
      steps: tourSteps
    };
    this.rawContent = {
      blocks: [
        {
          text: this.props.selectedDD.description || '',
          type: 'unstyled'
        }
      ],
      entityMap: {}
    };

    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectKey));
    }
    if (Object.keys(this.props.selectedDD).length === 0 && this.props.selectedDD.constructor === Object) {
      this.props.dispatch(fetchSelctedDD(this.state.issueKey));
    }
    if (this.props.selectedDD.hasOwnProperty('description') && this.props.selectedProject.hasOwnProperty('key')) {
      this.props.dispatch(receiveFileContent(null, [this.props.selectedDD.description], true));
    }
  }

  componentDidMount() {
    const doneDecisionTour = localStorage.getItem('doneDecisionTour') === 'yes';

    if (doneDecisionTour) {
      this.setState({
        isRunning: false
      });
      return;
    } else {
      setTimeout(() => {
        this.setState({
          isRunning: true
        });
      }, 1000);
      localStorage.setItem('doneDecisionTour', 'yes');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDD.hasOwnProperty('description') && nextProps.selectedProject.hasOwnProperty('key')) {
      this.props.dispatch(receiveFileContent(null, [nextProps.selectedDD.description], true));
      this.setState({ summary: nextProps.selectedDD.summary });
    }
  }

  onBackArrow = () => {
    history.push({
      pathname: '/recommender/' + this.state.projectKey + '/dd'
    });
  };

  handleRestartTour = () => {
    this.joyride.reset(true);
    this.setState({
      isRunning: true
    });
  };

  callback(data) {
    if (data.action === 'mouseenter' || data.action === 'start') {
      disableScroll.on();
    } else if (data.action === 'close' || data.type === 'finished') {
      disableScroll.off();
    }
  }

  render() {
    const { isRunning, joyrideOverlay, joyrideType, stepIndex, steps } = this.state;
    //  Breadcrumb navigation
    const breadcrumbs = [
      { url: '/', label: 'Home' },
      { url: '/projects', label: 'Projects' },
      { url: '/recommender/'.concat(this.props.projectKey).concat('/dd'), label: this.props.selectedProject.name },
      { label: this.props.issueKey }
    ];

    return (
      <div className={s.designDecision}>
        <Breadcrumb breadcrumbs={breadcrumbs} />
        <Grid container className={this.props.classes.gridContainer}>
          <Joyride
            ref={c => (this.joyride = c)}
            debug={false}
            callback={this.callback}
            locale={{
              back: <span>Back</span>,
              close: <span>Close</span>,
              last: <span>Done</span>,
              next: <span>Next</span>,
              skip: <span>Skip</span>
            }}
            run={isRunning}
            autoStart
            showOverlay={joyrideOverlay}
            showSkipButton={true}
            showStepsProgress={true}
            stepIndex={stepIndex}
            steps={steps}
            type={joyrideType}
          />
          <Grid item xs={7}>
            <div>
              <div className={s.headline}>{this.state.summary}</div> &nbsp;
              <span className={s.helpSpan}>
                <Tooltip title={'Show guides'} placement={'right'} enterDelay={300}>
                  <Help className={this.props.classes.helpIcon} onClick={this.handleRestartTour} />
                </Tooltip>
              </span>
            </div>
            <Amelietor triggerOnLoad={true} initialContent={this.rawContent} readOnly={true} />
            <EditorControls />
          </Grid>
          <Grid item xs={5} className={s.recommendations}>
            <TokenManager />
            <RecContainer />
            <SimilarDocuments issueKey={this.props.issueKey} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedDD, selectedProject } = state.screcs;
  return { selectedDD, selectedProject };
};

DesignDecision.propTypes = {
  projectKey: PropTypes.string.isRequired,
  issueKey: PropTypes.string.isRequired,
  selectedProject: PropTypes.object,
  selectedDD: PropTypes.object,
  classes: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(DesignDecision));
