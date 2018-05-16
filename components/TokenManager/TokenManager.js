import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import AddIcon from 'material-ui-icons/AddBox';
import Collapse from 'material-ui/transitions/Collapse';
import { addRec, removeRec } from '../../core/actions/actions';
import { decorate } from '../../core/actions/amelietorActions';
import { Textfield, Button} from 'react-mdl';

const styles = {
  title: {
    margin: 0
  }
};

class TokenManager extends Component {
  constructor(props) {
    super(props);
    this.state = { isAddNewOpen: false }

    this.deleteItem = token => {
      this.props.dispatch(removeRec(token));
      this.props.dispatch(decorate());
      return true;
    };

    this.addItem = this.addItem.bind(this);
  }

  addItem = () => {
    console.log(this.refs.addToken.inputRef.value);
    if (!this.refs.addToken.inputRef.value.trim()) {
      return
    } else {
      this.props.dispatch(addRec(this.refs.addToken.inputRef.value.trim()));
      this.props.dispatch(decorate());

      this.refs.addToken.inputRef.value = '';
      return true;
    }
  };

  toggleInfo = () => {
    this.setState({ isAddNewOpen: !this.state.isAddNewOpen });
  };

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

          <IconButton style={{float: "right"}}
            aria-label="add_box"
            onClick={e => { e.preventDefault(); this.toggleInfo() }} >
            <AddIcon />
          </IconButton>
        </h4>

        <Collapse in={this.state.isAddNewOpen} timeout="auto" unmountOnExit>
          <div>
            <Textfield
              onChange={() => {}}
              label={""}
              ref="addToken"
              floatingLabel
              style={{width: '200px', }}
            />
            <Button style={{float: "right"}} raised colored ripple onClick={(e)=> {e.preventDefault(); this.addItem(); }}> Add new</Button>
          </div>
        </Collapse>
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
