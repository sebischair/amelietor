import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {Spinner, Table, TableHeader, Textfield, Grid, Cell, Chip, List, ListItem, ListItemContent, ListItemAction, Checkbox} from 'react-mdl';
import {fetchSelctedProject, fetchDesignDecisions, selectDD} from '../../core/actions/scactions';
import s from './DesignDecisions.css';

class DesignDecisions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchDecisions: "", projectId: "", filterQA: false, filterAE: false, selectedAEs: [], selectedQAs: []};
    this.state.projectId = this.props.projectId === undefined ? HelperFunctions.getParameterByName("id", history.location.search) : this.props.projectId;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectId));
    }

    if (this.props.designDecisions.length == 0) {
      this.props.dispatch(fetchDesignDecisions(this.state.projectId));
    }
  }

  handleChange = (event) => {
    this.setState({searchDecisions: event.target.value});
  };

  onRowSelection = (event) => {
    if (event.length === 1) {
      let dd = this.findSelectedDD(event[0]);
      this.props.dispatch(selectDD(dd));
      history.push({
        pathname: '/designDecision',
        search: '?projectId='+ this.state.projectId +'&id=' + dd.id
      });
    }
  };

  findSelectedDD(id) {
    return this.props.designDecisions.find(dd => {
      return dd.id === id;
    });
  };

  filterQA = () => {
    if(this.state.filterQA) {
      this.setState({filterQA: false});
    } else {
      if(this.state.filterAE) this.setState({filterAE: false});
      this.setState({filterQA: true});
    }
  };

  filterAE = () => {
    if(this.state.filterAE) {
      this.setState({filterAE: false});
    } else {
      if(this.state.filterQA) this.setState({filterQA: false});
      this.setState({filterAE: true});
    }
  };

  render() {
    let designDecisions = this.props.designDecisions;
    let searchDecisions = this.state.searchDecisions.trim().toLowerCase();
    if (searchDecisions.length > 0) {
      designDecisions = designDecisions.filter(dd => {
        return ((dd.summary !== null && dd.summary.toLowerCase().indexOf(searchDecisions) !== -1) ||
        (dd.description !== null && dd.description.toLowerCase().indexOf(searchDecisions) !== -1));
      });
    }

    let QAList = "";
    let AEList = "";

    let aes = (designDecisions.map(dd => dd.concepts)).reduce((a, b) => {
      return a.concat(b);
    }, []).filter((x, i, a) => a.indexOf(x) == i);
    this.setState({selectedAEs: aes});

    let qas = (designDecisions.map(dd => dd.qualityAttributes)).reduce((a, b) => {
      return a.concat(b);
    }, []).filter((x, i, a) => a.indexOf(x) == i);
    this.setState({selectedQAs: qas});

    if(this.state.filterQA && this.props.designDecisions.length > 0) {
      QAList = <List style={{width: '300px', float: 'right'}}>
        {
          qas.map(qa =>
            <ListItem key={qa}>
              <ListItemContent avatar="person">{qa}</ListItemContent>
              <ListItemAction>
                <Checkbox defaultChecked/>
              </ListItemAction>
            </ListItem>
          )
        }
      </List>
    }

    if(this.state.filterAE && this.props.designDecisions.length > 0) {
      AEList = <List style={{width: '300px', float: 'right'}}>
        {
          aes.map(ae =>
            <ListItem key={ae}>
              <ListItemContent avatar="person">{ae}</ListItemContent>
              <ListItemAction>
                <Checkbox defaultChecked/>
              </ListItemAction>
            </ListItem>
          )
        }
      </List>
    }

    return (
      <div>

        <Grid>
          <Cell col={8}>
            <Textfield id='searchDecisions' value={this.state.searchDecisions} onChange={this.handleChange} label="Search..."
                       style={{width: '400px'}}/>
          </Cell>
          <Cell col={4} style={{textAlign: 'right'}}>
            <Chip onClick={this.filterQA}>Filter quality attributes</Chip>
            <Chip onClick={this.filterAE}>Filter architectural elements</Chip>
          </Cell>
          <Cell col={8}></Cell>
          <Cell col={4} style={{textAlign: 'right'}}>
            {this.state.filterQA && QAList}
            {this.state.filterAE && AEList}
          </Cell>
        </Grid>

        <div style={{'textAlign': 'center'}}> {this.props.designDecisions.length === 0 && <Spinner /> } </div>

        <Table sortable selectable rowKeyColumn="id" shadow={0} rows={designDecisions} className={`${s.customWidth}`}
               onSelectionChanged={this.onRowSelection}>
          <TableHeader name="summary" tooltip="Design decision"
                       sortFn={(a, b, isAsc) => (isAsc ? a : b).localeCompare((isAsc ? b : a))}>Design Decision</TableHeader>
          <TableHeader name="description" tooltip="Description">Description</TableHeader>
          <TableHeader name="qualityAttributes" tooltip="Quality Attributes">Quality Attributes</TableHeader>
          <TableHeader name="concepts" tooltip="Architectural Elements"
                       cellFormatter={(concept) => `${concept}\n`}>Architectural Elements</TableHeader>
          <TableHeader name="status" tooltip="Status">Status</TableHeader>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {selectedProject, designDecisions} = state.screcs;
  return {selectedProject, designDecisions};
};

DesignDecisions.propTypes = {
  designDecisions: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(DesignDecisions);
