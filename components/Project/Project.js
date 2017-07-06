import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Card, CardTitle, CardText, CardActions, Tabs, Tab} from 'react-mdl';
import history from '../../src/history';
import {fetchSelctedProject} from '../../core/actions/scactions';
import QualityAttributes from '../QualityAttributes';
import ArchitecturalElements from '../ArchitecturalElements';
import ExpertiseMatrix from '../ExpertiseMatrix';

class Project extends React.Component {
  constructor(props) {
    super(props);
    let projectId = getParameterByName("id", history.location.search);
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectId));
    }
    this.state = {activeTab: 0};
  }

  render() {
    return (
      <div>
        <Card shadow={0} style={{width: 'auto', height: 'auto', margin: 'auto', overflow: 'auto'}}>
          <CardTitle expand style={{color: 'black'}}>{ this.props.selectedProject.name }</CardTitle>
          <CardText>
            { this.props.selectedProject.description }
          </CardText>
          <CardActions border>
            <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({activeTab: tabId})} ripple>
              <Tab>Quality Attributes</Tab>
              <Tab>Architectural Elements</Tab>
              <Tab>Expertise Matrix</Tab>
              <Tab>Expert Recommender</Tab>
              <Tab>Design Decisions</Tab>
            </Tabs>
            <section>
              <br />
              <div className="content">
                {this.state.activeTab === 0 && <QualityAttributes projectId={this.props.selectedProject.projectId}/> }
                {this.state.activeTab === 1 && <ArchitecturalElements projectId={this.props.selectedProject.projectId}/> }
                {this.state.activeTab === 2 && <ExpertiseMatrix projectId={this.props.selectedProject.projectId}/> }
              </div>
            </section>
          </CardActions>
        </Card>
      </div>
    );
  }
}

function getParameterByName(name, string) {
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(string);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const mapStateToProps = (state) => {
  const {projects, selectedProject} = state.screcs;
  return {projects, selectedProject};
};

Project.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Project);
