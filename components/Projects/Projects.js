import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableRow, TablePagination, TableFooter } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';
import Joyride from 'react-joyride';
import disableScroll from 'disable-scroll';

import { fetchProjects, selectProject } from '../../core/actions/scactions';
import history from '../../src/history';
import EnhancedTableHead from '../EnhancedTableHead';
import s from './Projects.css';

const tourSteps = [
  {
    title: 'Search by keyword',
    text: 'Get projects matching either name, description or category.',
    selector: '.search-field',
    position: 'bottom',
    type: 'hover',
    isFixed: true
  },
  {
    title: 'Sort your projects',
    text: 'Each column can be sorted in ascending or descending order.',
    selector: '.table-head',
    position: 'bottom',
    type: 'hover',
    isFixed: true
  },
  {
    title: 'Project details',
    text: 'Click to open the project page with detailed information.',
    selector: '.one-row:first-child',
    position: 'top',
    type: 'hover',
    isFixed: true
  },
];

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.callback = this.callback.bind(this);
    this.state = {
      searchString: '',
      order: 'desc',
      orderBy: 'issuesCount',
      data: this.props.projects,
      page: 0,
      rowsPerPage: 25,
      joyrideOverlay: true,
      joyrideType: 'continuous',
      isRunning: false,
      stepIndex: 0,
      steps: tourSteps,
      selector: ''
    };
    if (this.props.projects.length === 0) {
      const projectsPromise = this.props.dispatch(fetchProjects());
      projectsPromise.then(projects => {
        this.setState({ data: projects });
      });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isRunning: true,
      });
    }, 2000);
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    if (this.state.orderBy === property && this.state.order === order) {
      return;
    }
    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));
    this.setState({ data, order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChangeSearch = event => {
    this.setState({ searchString: event.target.value });
  };

  openProjectRecommender = (event, key) => {
    const sp = this.findSelectedProject(key);
    this.props.dispatch(selectProject(sp));
    history.push({
      pathname: `/recommender/${sp.key}`
    });
  };

  findSelectedProject(projectKey) {
    return this.props.projects.find(p => p.key === projectKey);
  }

  issueCountCol = count => {
    return count > 0 ? count : '—';
  };

  displayIssuesTooltip = count => {
    if (count > 0) {
      return '';
    } else {
      return 'This project is not imported yet.';
    }
  };

  callback(data) {
    console.log('%cJoyride callback', 'color: #47AAAC; font-weight: bold; font-size: 13px;'); //eslint-disable-line no-console
    console.log(data); //eslint-disable-line no-console

    this.setState({
      selector: data.type === 'tooltip:before' ? data.step.selector : '',
    });

    if (data.action === 'mouseenter') {
      disableScroll.on();
    } else if (data.action === 'close' || data.type ==='finished') {
      disableScroll.off();
    }
  }

  render() {
    let projects = this.props.projects;
    const searchString = this.state.searchString.trim().toLowerCase();
    const { order, orderBy, rowsPerPage, page, isRunning, joyrideOverlay, joyrideType, stepIndex, steps } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, projects.length - page * rowsPerPage);
    const columnData = [
      { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
      { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
      { id: 'projectCategory', numeric: false, disablePadding: false, label: 'Category' },
      { id: 'issuesCount', numeric: true, disablePadding: false, label: 'Issue Count' }
    ];

    if (searchString.length > 0) {
      projects = projects.filter(
        project =>
          project.name.toLowerCase().indexOf(searchString) !== -1 ||
          project.description.toLowerCase().indexOf(searchString) !== -1 ||
          project.projectCategory.toLowerCase().indexOf(searchString) !== -1
      );
    }

    return (
      <div style={{ margin: '20px' }}>
        <Joyride
          debug={false}
          callback={this.callback}
          locale={{
            back: <span>Back</span>,
            close: <span>Close</span>,
            last: <span>Last</span>,
            next: <span>Next</span>,
            skip: <span>Skip</span>
          }}
          run={isRunning}
          showOverlay={joyrideOverlay}
          showSkipButton={true}
          showStepsProgress={true}
          stepIndex={stepIndex}
          steps={steps}
          type={joyrideType}
        />
        <div>
          <h3>Projects</h3>
        </div>
        <TextField
          id="searchProjects"
          value={this.state.searchString}
          onChange={this.handleChangeSearch}
          label="Search projects..."
          className={`${s.searchField} search-field`}
        />
        <br />
        <br />
        {this.props.projects.length === 0 && (
          <div className={s.circularProgress}>
            <CircularProgress />
            <br />
            <br />
          </div>
        )}
        {this.props.projects.length > 0 && (
          <Paper>
            <Table>
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
                columnData={columnData}
              />
              <TableBody>
                {projects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(project => (
                  <TableRow
                    hover
                    key={project.key}
                    className={`${s.table__clickable} one-row`}
                    onClick={e => this.openProjectRecommender(e, project.key)}
                  >
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>{project.projectCategory}</TableCell>
                    <TableCell numeric>
                      <Tooltip
                        title={this.displayIssuesTooltip(project.issuesCount)}
                        placement={'bottom-end'}
                        enterDelay={300}
                      >
                        <div className={s.issuesCount}>{this.issueCountCol(project.issuesCount)}</div>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
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
                    count={projects.length}
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
  const { projects } = state.screcs;
  return { projects };
};

Projects.propTypes = {
  projects: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Projects);
