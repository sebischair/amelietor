import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';
import Dialog from 'material-ui/Dialog';

import { decorate } from '../../core/actions/amelietorActions';
import UploadZone from '../UploadZone';
import s from './EditorControls.css';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    float: 'right',
    borderRadius: '4px'
  },
  progressBar: {
    textAlign: 'center'
  },
  message: {
    marginTop: '17px',
    fontSize: '1rem'
  }
});

class EditorControls extends React.Component {
  constructor(props) {
    super(props);
    this.annotate = () => {
      this.props.dispatch(decorate());
    };
    this.state = {
      allFetched: true,
      noErrors: true,
      dialogOpen: false
    };
  }

  static defaultProps = {
    hasUploadButton: false
  };

  componentWillReceiveProps(nextProps) {
    let annotations_list = [];
    Object.keys(nextProps.annotations).forEach(function(key) {
      annotations_list.push(nextProps.annotations[key]);
    });
    const checkAllFetched = (element, index, array) => {
      return element.isFetching === false;
    };
    const checkNoErrors = (element, index, array) => {
      return element.isError === false;
    };
    this.setState({
      allFetched: annotations_list.every(checkAllFetched),
      noErrors: annotations_list.every(checkNoErrors)
    });
  }

  openUploadZone = () => {
    this.setState({ dialogOpen: true });
  };

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  }

  render() {
    const { allFetched, noErrors } = this.state;
    return (
      <div className={`${s.controls}`}>
        <Grid container>
          {!allFetched && (
            <Grid item xs={12} className={this.props.classes.progressBar}>
              <LinearProgress />
              <Typography>Annotating&hellip; </Typography>
            </Grid>
          )}
          <Grid item xs={7}>
            {!noErrors && (
              <Typography className={this.props.classes.message}>
                Errors occurred. &nbsp;
                <a href="#">Show logs.</a>
              </Typography>
            )}
          </Grid>
          <Grid item xs={5}>
            {this.props.hasUploadButton && (
              <Button
              variant="raised"
              className={this.props.classes.button}
              onClick={e => {
                e.preventDefault();
                this.openUploadZone();
              }}
            >
              Upload
            </Button>
            )}
            <Button
              variant="raised"
              color="primary"
              className={this.props.classes.button}
              onClick={e => {
                e.preventDefault();
                this.annotate();
              }}
            >
              Annotate
            </Button>
          </Grid>
        </Grid>
        <Dialog open={this.state.dialogOpen} onClose={this.handleDialogClose}>
          <UploadZone />
        </Dialog>
      </div>
    );
  }
}

EditorControls.propTypes = {
  annotations: PropTypes.object.isRequired,
  hasUploadButton: PropTypes.bool,
  classes: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const annotations = state.annotationsByKey;
  return {
    annotations
  };
};

export default connect(mapStateToProps)(withStyles(styles)(EditorControls));
