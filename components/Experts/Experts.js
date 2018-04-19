import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Help from 'material-ui-icons/Help';
import Joyride from 'react-joyride';
import disableScroll from 'disable-scroll';

import HelperFunctions from '../HelperFunctions';
import { fetchSelctedProject, fetchERData } from '../../core/actions/scactions';
import history from '../../src/history';
import CollapseRow from './CollapseRow';
import s from './Experts.css';

const tourSteps = [
  {
    title: 'Expert scores',
    text: 'A higher expertise score indicates that the person has more experience in resolving similar design decisions.',
    selector: '.expert-scores',
    position: 'left',
    type: 'hover',
    isFixed: true
  }
];

const styles = {
  helpIcon: {
    fontSize: '14px',
    color: 'grey'
  }
};

class Experts extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.state = {
      searchString: '',
      page: 0,
      rowsPerPage: 10,
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isRunning: false,
      stepIndex: 0,
      steps: tourSteps
    };
    let projectKey =
      this.props.projectKey === undefined
        ? HelperFunctions.getParameterByName('projectKey', history.location.search)
        : this.props.projectKey;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectKey));
    }

    if (this.props.erData.length === 0) {
      this.props.dispatch(fetchERData(projectKey));
    }
  }

  componentDidMount() {
    const doneExpertsTour = localStorage.getItem('doneExpertsTour') === 'yes';

    if (doneExpertsTour) {
      this.setState({
        isRunning: false
      });
      return;
    } else {
      setTimeout(() => {
        this.setState({
          isRunning: true
        });
      }, 3000);
      localStorage.setItem('doneExpertsTour', 'yes');
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChangeSearch = event => {
    this.setState({ searchString: event.target.value });
  };

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
    let issues = this.props.erData.filter(e => {
      if (e.predictions) return e.predictions.length > 0;
      else return false;
    });
    let searchString = this.state.searchString.trim().toLowerCase();
    const { rowsPerPage, page, isRunning, joyrideOverlay, joyrideType, stepIndex, steps } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, issues.length - page * rowsPerPage);
    const numOfDisplayedExperts = 2;

    if (searchString.length > 0) {
      issues = issues.filter(add => {
        return add.text.toLowerCase().indexOf(searchString) !== -1;
      });
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
        <TextField
          value={this.state.searchString}
          onChange={this.handleChangeSearch}
          label="Search open decisions..."
          className={s.searchField}
        />
        <br />
        <br />
        {this.props.erData.length === 0 && (
          <div className={s.circularProgress}>
            <CircularProgress />
            <br />
            <br />
          </div>
        )}
        {this.props.erData.length > 0 && (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Open Design Decisions</TableCell>
                  <TableCell className={s.expertsColumn}>
                    <span>Experts Recommendation &nbsp;</span>
                    <span className={s.helpSpan}>
                      <Tooltip title={'Show guides'} placement={'bottom'} enterDelay={300}>
                        <Help className={this.props.classes.helpIcon} onClick={this.handleRestartTour} />
                      </Tooltip>
                    </span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((issue, indexOfIssue) => {
                  return (
                    <TableRow hover key={indexOfIssue}>
                      <TableCell>{issue.text}</TableCell>
                      <TableCell className={'expert-scores'}>
                        <CollapseRow issue={issue} numOfDisplayedExperts={numOfDisplayedExperts} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={6}
                    count={issues.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    backIconButtonProps={{
                      'aria-label': 'Previous Page'
                    }}
                    nextIconButtonProps={{
                      'aria-label': 'Next Page'
                    }}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedProject, erData } = state.screcs;
  return { selectedProject, erData };
};

Experts.propTypes = {
  erData: PropTypes.array.isRequired,
  projectKey: PropTypes.string,
  selectedProject: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  classes: PropTypes.object
};

export default connect(mapStateToProps)(withStyles(styles)(Experts));
