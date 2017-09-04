import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'react-mdl';
import { removeRec } from '../../core/actions/actions';
import {decorate} from "../../core/actions/amelietorActions";


class TokenManager extends Component {
  constructor(props) {
    super(props);
    const {dispatch, blocks} = this.props;
    this.deleteItem = (token) => {
      dispatch(removeRec(token));
      dispatch(decorate());
      return true;
    }
  }

  render() {
    if (!this.props.tokenData.token) {
      return <div />
    }
    return (
      <div>
        <h4 style={{marginTop: '0', color: '#000'}}>
          {this.props.tokenData.token}
          <Button accent onClick={e => { e.preventDefault(); this.deleteItem(this.props.tokenData.token) }}> <Icon name="delete" /></Button>
        </h4>
      </div>
    )
  }
}


TokenManager.propTypes = {
  tokenData: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { tokenData
  } = state.recs ;

  return {
    tokenData
  }
};

export default connect(mapStateToProps)(TokenManager)
