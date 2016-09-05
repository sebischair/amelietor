import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle, CardActions, Button, Icon } from 'react-mdl';


class TokenManager extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <Card shadow={0} style={{width: 'auto', margin: 'auto'}}>
        <CardTitle expand style={{alignItems: 'flex-start', color: '#000'}}>
          <h4 style={{marginTop: '0', color: '#000'}}>
            {this.props.tokenData.token}
          </h4>
        </CardTitle>
        <CardActions border style={{display: 'flex', boxSizing: 'border-box', alignItems: 'center'}}>
          <Button accent> <Icon name="delete" /> Remove annotation</Button>
          <div className="mdl-layout-spacer"></div>
        </CardActions>
      </Card>
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
