import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { CircularProgress } from 'material-ui/Progress';
import Joyride from 'react-joyride';
import disableScroll from 'disable-scroll';

import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import { fetchSelctedProject, fetchQAData } from '../../core/actions/scactions';
import StackedBarChart from '../StackedBarChart/StackedBarChart';
import s from './QualityAttributes.css';

const tourSteps = [
  {
    title: 'Project evolution',
    text: 'View design decisions in a chronological order.',
    selector: '.year-slider',
    position: 'bottom',
    type: 'hover',
    isFixed: true
  },
  {
    text:
      'These quality attributes are not addressed by any design decision. This indicates potential risks in the project.',
    selector: '.missing-qa',
    position: 'left',
    type: 'hover',
    isFixed: true
  },
  {
    title: 'Categorized design decisions',
    text: 'Click on a bar to see non-existence, behavioral or structural design decisions.',
    selector: '.segment:first-child',
    position: 'top',
    type: 'hover',
    isFixed: true
  }
];

class QualityAttributes extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.state = {
      projectKey: this.props.projectKey,
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isRunning: false,
      stepIndex: 0,
      steps: tourSteps
    };

    if (this.props.projectKey === undefined) {
      this.setState({ projectKey: HelperFunctions.getParameterByName('projectKey', history.location.search) });
    }
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectKey));
    }
    if (this.props.qaData.length === 0) {
      const QApromise = this.props.dispatch(fetchQAData(this.state.projectKey));
      QApromise.then(() => {
        this.checkDoneTour();
      });
    }
  }

  componentDidMount() {
    if (this.props.qaData.length > 0) {
      this.checkDoneTour();
    }
  }

  checkDoneTour = () => {
    const doneAttributeTour = localStorage.getItem('doneAttributeTour') === 'yes';
    if (doneAttributeTour) {
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
      localStorage.setItem('doneAttributeTour', 'yes');
    }
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
    let emptyDDList = '';
    if (this.props.qaData.length > 0) {
      emptyDDList = (
        <div className="mdl-card__supporting-text missing-qa">
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
                <StackedBarChart
                  data={this.props.qaData}
                  changeTabHandler={this.props.changeTabHandler}
                  viz="qa"
                  handleRestartTour={this.handleRestartTour}
                />
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
