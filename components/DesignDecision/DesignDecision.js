import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Card, CardTitle, CardText, CardActions, Tabs, Tab, Button, FABButton, Icon, Grid, Cell} from 'react-mdl';
import history from '../../src/history';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject, fetchSelctedDD} from '../../core/actions/scactions';
import Link from "../Link/Link";

class DesignDecision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projectId: "", ddId: "", activeTab: 0};

    this.state.projectId = HelperFunctions.getParameterByName("projectId", history.location.search);
    this.state.ddId = HelperFunctions.getParameterByName("id", history.location.search);

    if (Object.keys(this.props.selectedDD).length === 0 && this.props.selectedDD.constructor === Object) {
      this.props.dispatch(fetchSelctedDD(this.state.ddId));
    }

    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectId));
    }
  }

  onBackArrow = () => {
      history.push({
        pathname: '/recommender',
        search: '?id=' + this.state.projectId
      });
  };

  render() {
    let actionsView = null;
    if(this.props.selectedProject.issuesCount > 0) {
      actionsView =
        <CardActions border>
        <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({activeTab: tabId})} ripple>
          <Tab>Design Decision</Tab>
        </Tabs>
        <section>
          <br />
          <div className="content">
            {this.state.activeTab === 0 && <div>{this.props.selectedDD.description}</div> }
          </div>
        </section>
      </CardActions>
    } else {
      actionsView =
        <CardActions border>
          <section>
            <br />
            <div className="content">
              Import this project using <Button raised accent ripple>Syncpipes</Button>
            </div>
          </section>
        </CardActions>
    }

    return (
      <div>
        <Card shadow={0} style={{width: 'auto', height: 'auto', margin: 'auto', overflow: 'auto'}}>
          <CardTitle expand style={{color: 'black'}}>
            { this.props.selectedProject.name }
          </CardTitle>
          <CardText>
            <div style={{width: '100%', margin: 'auto'}}>
              <Grid>
                <Cell col={10}>{ this.props.selectedProject.description }</Cell>
                <Cell col={2}>
                  <FABButton colored ripple onClick={this.onBackArrow}>
                    <Icon name="reply" />
                  </FABButton>
                </Cell>
              </Grid>
            </div>
          </CardText>
          {actionsView}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {selectedDD, selectedProject} = state.screcs;
  return {selectedDD, selectedProject};
};

DesignDecision.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(DesignDecision);
