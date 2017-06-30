import React, {PropTypes} from 'react';
import { Table, TableHeader, Textfield } from 'react-mdl';
import { fetchProjects } from '../../core/actions/scactions';
import { connect } from 'react-redux'
import s from './ProjectCard.css';

class ProjectCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchString: ""};
    if(this.props.projects.length == 0) {
      this.props.dispatch(fetchProjects());
    }
  }

  handleChange = (event) => {
    this.setState({searchString: event.target.value});
  };

  render() {
    let projects = this.props.projects;
    let searchString = this.state.searchString.trim().toLowerCase();
    if(searchString.length > 0) {
      projects = projects.filter(project => {
        return ((project.name.toLowerCase().indexOf(searchString) !== -1) ||
          (project.description.toLowerCase().indexOf(searchString) !== -1) ||
          (project.projectCategory.toLowerCase().indexOf(searchString) !== -1));
      });
    }

    return(
      <div>
        <Textfield value={this.state.searchString} onChange={this.handleChange} label="Search..." style={{width: '400px'}} />
        <Table sortable shadow={0} rows={projects} className={`${s.customWidth}`}>
          <TableHeader name="name" tooltip="Project Name" sortFn={(a, b, isAsc) => (isAsc ? a : b).localeCompare((isAsc ? b : a))}>Project Name</TableHeader>
          <TableHeader name="description" tooltip="Description">Description</TableHeader>
          <TableHeader name="projectCategory" tooltip="Category">Category</TableHeader>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { projects } = state.screcs || [];
  return { projects };
};

ProjectCard.propTypes = {
  projects: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(ProjectCard);

