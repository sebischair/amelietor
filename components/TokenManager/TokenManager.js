import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle, CardActions, Button, Icon } from 'react-mdl';
import {removeRec, fetchAnnotationsPerBlock} from '../../core/actions';

class TokenManager extends Component {
  constructor(props) {
    super(props);
    const {dispatch, blocks} = this.props;
    this.deleteItem = (token) => {
      dispatch(removeRec(token));
      blocks.map(block => dispatch(fetchAnnotationsPerBlock(block)));
      return true;
    }
  }

  render() {
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
  blocks: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  const { tokenData
  } = state.recs ;

  return {
    tokenData
  }
};

export default connect(mapStateToProps)(TokenManager)
