import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableRow, TablePagination, TableFooter } from 'material-ui/Table';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import { ListItemText } from 'material-ui/List';
import Select from 'material-ui/Select';
import Checkbox from 'material-ui/Checkbox';

import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import { fetchSelctedProject, fetchDesignDecisions, selectDD, fetchAllQA } from '../../core/actions/scactions';
import EnhancedTableHead from '../EnhancedTableHead';
import s from './DesignDecisions.css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

class DesignDecisions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      projectKey: this.props.projectKey,
      order: 'desc',
      orderBy: '',
      data: this.props.designDecisions,
      page: 0,
      rowsPerPage: 25,
      qaFilters: [],
      searchStringAE: '',
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
    if (this.props.allQA.length === 0) {
      this.props.dispatch(fetchAllQA());
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

  handleChangeSearchAE = event => {
    this.setState({ searchStringAE: event.target.value });
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

  joinArray = (data) => {
    return Array.isArray(data) ? data.join(', ') : data;
  };

  handleQAChange = event => {
    this.setState({ qaFilters: event.target.value });
  };

  handleClearFilters = () => {
    this.setState({
      searchString: '',
      qaFilters: [],
      searchStringAE: ''
    })
  };

  hasFilter = () => {
    let result =(this.state.searchString.length > 0) || (this.state.qaFilters.length > 0) || (this.state.searchStringAE.length > 0);
    console.log(result);
    return result;
  };

  render() {
    let designDecisions = this.props.designDecisions;
    let searchString = this.state.searchString.trim().toLowerCase();
    let searchStringAE = this.state.searchStringAE.trim().toLowerCase();
    const hasFilter = this.hasFilter();
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
    // Filter selected quality attributes
    designDecisions = designDecisions.filter(dd => {
      let result = true;
      this.state.qaFilters.forEach((qaFilter) => {
        if (dd.qualityAttributes.indexOf(qaFilter) === -1) {
          result = false;
        }
      })
      return result;
    });
    // Search field for architectural elements
    if (searchStringAE.length > 0) {
      designDecisions = designDecisions.filter(dd => {
        return dd.concepts && this.joinArray(dd.concepts).toLowerCase().indexOf(searchStringAE) > -1;
      });
    }

    return (
      <div>
        <TextField
          id="searchString"
          value={this.state.searchString}
          onChange={this.handleChangeSearch}
          label="Search design decisions..."
          className={s.searchField}
        />
        &nbsp; &nbsp;
        <FormControl className={s.filters}>
          <InputLabel htmlFor="select-multiple-checkbox">Select quality attributes</InputLabel>
          <Select
            multiple
            value={this.state.qaFilters}
            onChange={this.handleQAChange}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {this.props.allQA.map(qa => (
              <MenuItem key={qa} value={qa}>
                <Checkbox checked={this.state.qaFilters.indexOf(qa) > -1} />
                <ListItemText primary={qa} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        &nbsp; &nbsp;
        <TextField
          id="searchStringAE"
          value={this.state.searchStringAE}
          onChange={this.handleChangeSearchAE}
          label="Search architectural elements..."
          className={s.searchField}
        />
        <br />
        <br />
        {hasFilter &&
          <Typography gutterBottom>
            Showing {designDecisions.length} matching results.
            <a href='#' onClick={this.handleClearFilters}>
              Click here to clear all filters.
            </a>
          </Typography>
        }

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
                  <TableCell>
                    {this.joinArray(decision.qualityAttributes)}
                  </TableCell>
                  <TableCell>
                    {this.joinArray(decision.concepts)}
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
  const { selectedProject, designDecisions, allQA } = state.screcs;
  return { selectedProject, designDecisions, allQA };
};

DesignDecisions.propTypes = {
  designDecisions: PropTypes.array.isRequired,
  allQA: PropTypes.array.isRequired,
  projectKey: PropTypes.string,
  selectedProject: PropTypes.object,
  viz: PropTypes.string,
  attrName: PropTypes.string,
  segmentName: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(DesignDecisions);
