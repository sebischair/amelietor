import React, { PropTypes } from 'react';
import * as d3 from 'd3';
import rd3 from 'react-d3-library';
import { Slider } from 'react-mdl';
import { withStyles } from 'material-ui/styles';
import Tooltip from 'material-ui/Tooltip';
import Help from 'material-ui-icons/Help';
import Joyride from 'react-joyride';
import disableScroll from 'disable-scroll';

import d3BubbleChart from './d3BubbleChart';
import s from './BubbleChart.css';

const minYear = 2013;
const maxYear = 2017;
const defaultYear = 2017;
const defaultHeight = 560;
const defaultWidth = 960;

const tourSteps = [
  {
    title: 'Design decisions with a certain topic',
    text: 'Click on a bubble to see all the design decisions related to a specific architectural element.',
    selector: '.node:first-child',
    position: 'right',
    type: 'hover',
    isFixed: true
  }
];

const styles = {
  helpIcon: {
    fontSize: '16px',
    color: 'grey'
  }
};

class BubbleChart extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.state = {
      d3: '',
      year: defaultYear,
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isRunning: false,
      stepIndex: 0,
      steps: tourSteps
    };
  }

  componentDidMount() {
    const doneBubbleTour = localStorage.getItem('doneBubbleTour') === 'yes';
    let changeTabHandler = this.props.changeTabHandler;
    let viz = this.props.viz;
    this.setState({ d3: d3BubbleChart.getNode(this.props.data, defaultHeight, defaultWidth) });
    d3.selectAll('circle').on('click', d => {
      changeTabHandler(4, viz, d.id, 'default');
    });

    // Check whether the user has already saw the tour guide
    if (doneBubbleTour) {
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
      localStorage.setItem('doneBubbleTour', 'yes');
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

  redraw = event => {
    this.setState({
      d3: d3BubbleChart.redraw(this.props.data, event.target.value, defaultHeight, defaultWidth),
      year: event.target.value
    });
  };

  render() {
    const RD3Component = rd3.Component;
    const { isRunning, joyrideOverlay, joyrideType, stepIndex, steps } = this.state;

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
        <div className={`${s.bubbleChart}`}>
          {this.state.d3 && <Slider min={minYear} max={maxYear} defaultValue={defaultYear} onChange={this.redraw} />}
          {this.state.year} &nbsp;
          <span className={s.helpSpan}>
            <Tooltip title={'Show guides'} placement={'right'} enterDelay={300}>
              <Help className={this.props.classes.helpIcon} onClick={this.handleRestartTour} />
            </Tooltip>
          </span>
        </div>
        <div className={`${s.bubbleChart}`}>
          <svg height={defaultHeight} width={defaultWidth} className="bubble" id="bubbleSvg" />
          {this.state.d3 && <RD3Component data={this.state.d3} />}
        </div>
      </div>
    );
  }
}

BubbleChart.propTypes = {
  data: PropTypes.array.isRequired,
  changeTabHandler: PropTypes.func,
  viz: PropTypes.string,
  classes: PropTypes.object
};

export default withStyles(styles)(BubbleChart);
