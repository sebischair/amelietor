import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Table, {
  TableBody,
  TableCell,
  TableRow,
  TablePagination,
  TableFooter,
} from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';

import { fetchProjects, selectProject } from '../../core/actions/scactions';
import history from '../../src/history';
import EnhancedTableHead from './EnhancedTableHead';
import s from './Projects.css';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      order: 'desc',
      orderBy: 'issuesCount',
      data: this.props.projects,
      page: 0,
      rowsPerPage: 25,
    };
    if (this.props.projects.length === 0) {
      const projectsPromise = this.props.dispatch(fetchProjects());
      projectsPromise.then((projects) => {
        this.state.data = projects;
      });
    }
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

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChangeSearch = (event) => {
    this.setState({ searchString: event.target.value });
  };

  openProjectRecommender = (event, key) => {
    const sp = this.findSelectedProject(key);
    this.props.dispatch(selectProject(sp));
    history.push({
      pathname: `/recommender/${sp.key}`,
    });
  };

  findSelectedProject(projectKey) {
    return this.props.projects.find(p => p.key === projectKey);
  }

  issueCountCol = (count) => {
    return count > 0 ? count : '—';
  };

  displayIssuesTooltip = (count) => {
    if (count > 0) {
      return "";
    } else {
      return "This project is not imported yet."
    }
  }

  render() {
    let projects = this.props.projects;
    const searchString = this.state.searchString.trim().toLowerCase();
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, projects.length - (page * rowsPerPage));

    if (searchString.length > 0) {
      projects = projects.filter(
        project =>
          project.name.toLowerCase().indexOf(searchString) !== -1 ||
          project.description.toLowerCase().indexOf(searchString) !== -1 ||
          project.projectCategory.toLowerCase().indexOf(searchString) !== -1,
      );
    }

    return (
      <div style={{ margin: '20px' }}>
        <div>
          <h3>Projects</h3>
        </div>
        <TextField
          id="searchProjects"
          value={this.state.searchString}
          onChange={this.handleChangeSearch}
          label="Search projects..."
          className={s.searchField}
        />
        <br/><br/>
        <div className={s.circularProgress}>
          {this.props.projects.length === 0 && <CircularProgress />}
        </div>

        <Paper>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
            />
            <TableBody>
              {projects.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage).map(project => (
                <TableRow
                  hover
                  key={project.key}
                  className={s.table__clickable}
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
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { projects } = state.screcs;
  return { projects };
};

Projects.propTypes = {
  projects: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(Projects);
