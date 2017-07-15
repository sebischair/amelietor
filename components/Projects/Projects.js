import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Table, TableHeader, Textfield, Spinner} from 'react-mdl';
import {fetchProjects, selectProject} from '../../core/actions/scactions';
import history from '../../src/history';
import s from './Projects.css';

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchString: ""};
    if (this.props.projects.length == 0) {
      this.props.dispatch(fetchProjects());
    }
  }

  handleChange = (event) => {
    this.setState({searchString: event.target.value});
  };

  onRowSelection = (event) => {
    if (event.length === 1) {
      let sp = this.findSelectedProject(event[0]);
      this.props.dispatch(selectProject(sp));
      console.log(sp);
      history.push({
        pathname: '/recommender',
        search: '?id=' + sp.projectId
      });
    }
  };

  findSelectedProject(projectName) {
    return this.props.projects.find(p => {
      return p.name === projectName;
    });
  };

  render() {
    let projects = this.props.projects;
    let importedProjects = projects.filter(p => {
      return p.issuesCount > 0;
    });
    let availableProjects = projects.filter(p => {
      return p.issuesCount <= 0;
    });
    let searchString = this.state.searchString.trim().toLowerCase();
    if (searchString.length > 0) {
      importedProjects = importedProjects.filter(project => (project.name.toLowerCase().indexOf(searchString) !== -1) || (project.description.toLowerCase().indexOf(searchString) !== -1) || (project.projectCategory.toLowerCase().indexOf(searchString) !== -1));
      availableProjects = availableProjects.filter(project => ((project.name.toLowerCase().indexOf(searchString) !== -1) || (project.description.toLowerCase().indexOf(searchString) !== -1) || (project.projectCategory.toLowerCase().indexOf(searchString) !== -1)));
    }

    return (
      <div>
        <Textfield id='searchProjects' value={this.state.searchString} onChange={this.handleChange} label="Search..."
                   style={{width: '400px'}}/>
        <div style={{'text-align': 'center'}}>
          {this.props.projects.length === 0 && <Spinner /> }
        </div>
        <div>
          <div><h3>Imported Projects</h3></div>
          <Table sortable selectable rowKeyColumn="name" shadow={0} rows={importedProjects}
                 className={`${s.customWidth}`}
                 onSelectionChanged={this.onRowSelection}>
            <TableHeader name="name" tooltip="Project Name"
                         sortFn={(a, b, isAsc) => (isAsc ? a : b).localeCompare((isAsc ? b : a))}>Project
              Name</TableHeader>
            <TableHeader name="shortDescription" tooltip="Description">Description</TableHeader>
            <TableHeader name="projectCategory" tooltip="Category">Category</TableHeader>
          </Table>
        </div>
        <div>
          <div><h3>Available Projects</h3></div>
          <Table sortable selectable rowKeyColumn="name" shadow={0} rows={availableProjects}
                 className={`${s.customWidth}`}
                 onSelectionChanged={this.onRowSelection}>
            <TableHeader name="name" tooltip="Project Name"
                         sortFn={(a, b, isAsc) => (isAsc ? a : b).localeCompare((isAsc ? b : a))}>Project
              Name</TableHeader>
            <TableHeader name="shortDescription" tooltip="Description">Description</TableHeader>
            <TableHeader name="projectCategory" tooltip="Category">Category</TableHeader>
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {projects} = state.screcs;
  return {projects};
};

Projects.propTypes = {
  projects: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Projects);
