import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Tooltip from 'material-ui/Tooltip';

import HelperFunctions from '../HelperFunctions';
import { fetchSelctedProject, fetchERData } from '../../core/actions/scactions';
import history from '../../src/history';
import CollapseRow from './CollapseRow';
import s from './Experts.css';

class Experts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      page: 0,
      rowsPerPage: 10
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChangeSearch = event => {
    this.setState({ searchString: event.target.value });
  };

  render() {
    let issues = this.props.erData.filter(e => {
      if (e.predictions) return e.predictions.length > 0;
      else return false;
    });
    let searchString = this.state.searchString.trim().toLowerCase();
    const { rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, issues.length - page * rowsPerPage);
    const numOfDisplayedExperts = 2;

    if (searchString.length > 0) {
      issues = issues.filter(add => {
        return add.text.toLowerCase().indexOf(searchString) !== -1;
      });
    }

    return (
      <div>
        <TextField
          value={this.state.searchString}
          onChange={this.handleChangeSearch}
          label="Search open decisions..."
          className={s.searchField}
        />
        <br />
        <br />
        {issues.length === 0 && (
          <div className={s.circularProgress}>
            <CircularProgress />
            <br />
            <br />
          </div>
        )}

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Open Design Decisions</TableCell>
                <TableCell className={s.expertsColumn}>
                  <Tooltip
                    title="The score indicates how experienced the expert is on this issue."
                    placement={'bottom-start'}
                    enterDelay={300}
                  >
                    <span>Experts Recommendation</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((issue, indexOfIssue) => {
                return (
                  <TableRow hover key={indexOfIssue}>
                    <TableCell>{issue.text}</TableCell>
                    <TableCell>
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
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Experts);
