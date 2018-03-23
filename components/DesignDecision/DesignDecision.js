import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import history from '../../src/history';
import Amelietor from '../Amelietor';
import TokenManager from '../TokenManager';
import RecContainer from '../RecContainer';
import EditorControls from '../EditorControls';
import SimilarDocuments from '../SimilarDocuments';
import { fetchSelctedProject, fetchSelctedDD } from '../../core/actions/scactions';
import { receiveFileContent } from '../../core/actions/actions';
import s from './DesignDecision.css';

const styles = {
  gridContainer: {
    margin: 0
  }
};

class DesignDecision extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectKey: this.props.projectKey,
      issueKey: this.props.issueKey,
      summary: this.props.selectedDD.summary,
      similarDocuments: []
    };
    this.rawContent = {
      blocks: [
        {
          text: this.props.selectedDD.description || '',
          type: 'unstyled'
        }
      ],
      entityMap: {}
    };

    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(this.state.projectKey));
    }
    if (Object.keys(this.props.selectedDD).length === 0 && this.props.selectedDD.constructor === Object) {
      this.props.dispatch(fetchSelctedDD(this.state.issueKey));
    }
    if (this.props.selectedDD.hasOwnProperty('description') && this.props.selectedProject.hasOwnProperty('key')) {
      this.props.dispatch(receiveFileContent(null, [this.props.selectedDD.description], true));
    }
    if (this.props.selectedDD.similarDocuments !== undefined && this.props.selectedDD.similarDocuments !== null) {
      this.state.similarDocuments = this.props.selectedDD.similarDocuments;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDD.hasOwnProperty('description') && nextProps.selectedProject.hasOwnProperty('key')) {
      this.props.dispatch(receiveFileContent(null, [nextProps.selectedDD.description], true));
      this.setState({ summary: nextProps.selectedDD.summary });
    }
  }

  onBackArrow = () => {
    history.push({
      pathname: '/recommender/' + this.state.projectKey + '/dd'
    });
  };

  render() {
    return (
      <Grid container className={this.props.classes.gridContainer}>
        <Grid item xs={7}>
          <h3>{this.state.summary}</h3>
          <Amelietor triggerOnLoad={true} initialContent={this.rawContent} readOnly={true} />
          <EditorControls />
        </Grid>
        <Grid item xs={5} className={s.recommendations}>
          <TokenManager />
          <RecContainer />
          <SimilarDocuments similarDocuments={this.state.similarDocuments} />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  const { selectedDD, selectedProject } = state.screcs;
  return { selectedDD, selectedProject };
};

DesignDecision.propTypes = {
  projectKey: PropTypes.string.isRequired,
  issueKey: PropTypes.string.isRequired,
  selectedProject: PropTypes.object,
  selectedDD: PropTypes.object,
  classes: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(DesignDecision));
