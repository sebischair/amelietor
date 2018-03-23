import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';

import { removeRec } from '../../core/actions/actions';
import { decorate } from '../../core/actions/amelietorActions';

const styles = {
  title: {
    margin: 0
  }
};

class TokenManager extends Component {
  constructor(props) {
    super(props);
    this.deleteItem = token => {
      this.props.dispatch(removeRec(token));
      this.props.dispatch(decorate());
      return true;
    };
  }

  render() {
    if (!this.props.tokenData.token) {
      return <div />;
    }
    return (
      <div>
        <h4 className={this.props.classes.title}>
          {this.props.tokenData.token}
          <IconButton
            aria-label="Delete"
            onClick={e => {
              e.preventDefault();
              this.deleteItem(this.props.tokenData.token);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </h4>
      </div>
    );
  }
}

TokenManager.propTypes = {
  tokenData: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { tokenData } = state.recs;
  return { tokenData };
};

TokenManager.propTypes = {
  classes: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(TokenManager));
