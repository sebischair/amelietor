import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableRow, TablePagination, TableFooter } from 'material-ui/Table';
import { Grid, Cell, RadioGroup, Radio } from 'react-mdl';

import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import { fetchSelctedProject, fetchDesignDecisions, selectDD } from '../../core/actions/scactions';
import EnhancedTableHead from '../EnhancedTableHead';
import s from './DesignDecisions.css';

class DesignDecisions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      projectKey: this.props.projectKey,
      filter: 'null',
      order: 'desc',
      orderBy: 'issuesCount',
      data: this.props.designDecisions,
      page: 0,
      rowsPerPage: 25
    };

    if (this.props.projectKey === undefined) {
      this.setState({ projectKey: HelperFunctions.getParameterByName('projectKey', history.location.search) })
    }
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectKey));
    }

    if (this.props.designDecisions.length === 0) {
      const decisionsPromise = this.props.dispatch(
        fetchDesignDecisions(this.state.projectKey, this.props.viz, this.props.attrName, this.props.segmentName)
      );
      decisionsPromise.then(decisions => {
        this.setState({ data: decisions });
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

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChangeSearch = event => {
    this.setState({ searchString: event.target.value });
  };

  openDecisionEditor = (event, name) => {
    let dd = this.findSelectedDD(name);
    this.props.dispatch(selectDD(dd));
    history.push({
      pathname: '/designDecision/' + dd.name + '/project/' + this.state.projectKey
    });
  };

  findSelectedDD(name) {
    return this.props.designDecisions.find(dd => {
      return dd.name === name;
    });
  }

  filter = event => {
    this.setState({ filter: event.target.value });
  };

  joinConcepts = (concepts) => {
    return Array.isArray(concepts) ? concepts.join(', ') : concepts;
  };

  render() {
    let designDecisions = this.props.designDecisions;
    let searchString = this.state.searchString.trim().toLowerCase();
    const { order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, designDecisions.length - page * rowsPerPage);
    const columnData = [
      { id: 'summary', numeric: false, disablePadding: false, label: 'Design Decision' },
      { id: 'shortDescription', numeric: false, disablePadding: false, label: 'Description' },
      { id: 'qualityAttributes', numeric: false, disablePadding: false, label: 'Quality Attributes' },
      { id: 'concepts', numeric: false, disablePadding: false, label: 'Architectural Elements' },
      { id: 'decisionCategory', numeric: false, disablePadding: false, label: 'Decision Category' },
      { id: 'status', numeric: false, disablePadding: false, label: 'Status' }
    ];

    if (searchString.length > 0) {
      designDecisions = designDecisions.filter(dd => {
        return (
          (dd.summary !== null && dd.summary.toLowerCase().indexOf(searchString) !== -1) ||
          (dd.description !== null && dd.description.toLowerCase().indexOf(searchString) !== -1)
        );
      });
    }
    switch (this.state.filter) {
      case 'qa':
        designDecisions = designDecisions.filter(dd => {
          return dd.qualityAttributes.length > 0;
        });
        break;
      case 'ae':
        designDecisions = designDecisions.filter(dd => {
          return dd.concepts.length > 0;
        });
        break;
    }

    return (
      <div>
        <Grid>
          <Cell col={8}>
            <TextField
              id="searchString"
              value={this.state.searchString}
              onChange={this.handleChangeSearch}
              label="Search design decisions..."
              className={s.searchField}
            />
          </Cell>
          <Cell col={4}>
            <RadioGroup
              container="ul"
              childContainer="li"
              name="filters"
              value={this.state.filter}
              onChange={this.filter}
              className={`${s.filters}`}
            >
              <Radio value="null">No filter</Radio>
              <Radio value="qa">Filter quality attributes</Radio>
              <Radio value="ae">Filter architectural elements</Radio>
            </RadioGroup>
          </Cell>
          <Cell col={8} />
          <Cell col={4} style={{ textAlign: 'right' }} />
        </Grid>
        <br />
        <br />
        <div className={s.circularProgress}>{this.props.designDecisions.length === 0 && <CircularProgress />}</div>

        <Paper>
          <Table>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              columnData={columnData}
            />
            <TableBody>
              {designDecisions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((decision, index) => (
                <TableRow
                  hover
                  key={index}
                  className={s.table__clickable}
                  onClick={e => this.openDecisionEditor(e, decision.name)}
                >
                  <TableCell>{decision.summary}</TableCell>
                  <TableCell>{decision.shortDescription}</TableCell>
                  <TableCell>{decision.qualityAttributes}</TableCell>
                  <TableCell>
                    {this.joinConcepts(decision.concepts)}
                  </TableCell>
                  <TableCell>{decision.decisionCategory}</TableCell>
                  <TableCell>{decision.status}</TableCell>
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
                  count={designDecisions.length}
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
  const { selectedProject, designDecisions } = state.screcs;
  return { selectedProject, designDecisions };
};

DesignDecisions.propTypes = {
  designDecisions: PropTypes.array.isRequired,
  projectKey: PropTypes.string,
  selectedProject: PropTypes.object,
  viz: PropTypes.string,
  attrName: PropTypes.string,
  segmentName: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(DesignDecisions);
