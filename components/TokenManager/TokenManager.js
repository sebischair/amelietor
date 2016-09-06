import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle, CardActions, Button, Icon } from 'react-mdl';


class TokenManager extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h4 style={{marginTop: '0', color: '#000'}}>
          {this.props.tokenData.token}
          <Button accent> <Icon name="delete" /></Button>
        </h4>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { tokenData,
  } = state.recs ;

  return {
    tokenData
  }
};

export default connect(mapStateToProps)(TokenManager)
