import React, { PropTypes } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Tooltip from 'material-ui/Tooltip';
import Help from 'material-ui-icons/Help';
import Joyride from 'react-joyride';
import disableScroll from 'disable-scroll';

import Amelietor from '../Amelietor';
import TokenManager from '../TokenManager';
import RecContainer from '../RecContainer';
import EditorControls from '../EditorControls';
import s from './ExampleEditor.css';

const tourSteps = [
  {
    title: 'Design decision description',
    text:
      'Put your design decision here and annotate with architectural elements. Get recommendations for corresponding solutions.',
    selector: '.amelie-editor',
    position: 'right',
    type: 'hover',
    isFixed: true
  }
];

const styles = {
  gridContainer: {
    margin: '16px'
  },
  textField: {
    width: '600px',
    margin: '15px 0 30px 0'
  },
  helpIcon: {
    fontSize: '16px',
    color: 'grey'
  }
};

const rawContent = {
  blocks: [
    {
      text:
        'The Yummy Inc online application will be deployed onto a ' +
        'J2EE application server Websphere Application Server version 6, ' +
        'as it is already the application server use for internal applications.',
      type: 'unstyled'
    },
    {
      text: '',
      type: 'unstyled'
    },
    {
      text: 'J2EE security model will be reused. ' + 'Data persistence will be addressed using a relational database.',
      type: 'unstyled'
    },
    {
      text: '',
      type: 'unstyled'
    }
  ],
  entityMap: {}
};

class ExampleEditor extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.state = {
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isRunning: false,
      stepIndex: 0,
      steps: tourSteps
    };
  }

  componentDidMount() {
    const doneEditorTour = localStorage.getItem('doneEditorTour') === 'yes';

    if (doneEditorTour) {
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
      localStorage.setItem('doneEditorTour', 'yes');
    }
  }

  handleRestartTour = event => {
    this.joyride.reset();
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
    return (
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
            <TextField className={this.props.classes.textField} onChange={() => {}} label="Document name" />&nbsp;
            <span className={s.helpSpan}>
              <Tooltip title={'Show guides'} placement={'right'} enterDelay={300}>
                <Help className={this.props.classes.helpIcon} onClick={this.handleRestartTour} />
              </Tooltip>
            </span>
          </div>
          <Amelietor initialContent={rawContent} />
          <EditorControls hasUploadButton={true} />
        </Grid>
        <Grid item xs={7} className={s.recommendations}>
          <TokenManager />
          <RecContainer />
        </Grid>
      </Grid>
    );
  }
}

ExampleEditor.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(ExampleEditor);
