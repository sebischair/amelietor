import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import {fetchRecMeta} from '../../core/actions';
import Rec from '../Rec'
import { Card, CardText, Tab, Tabs } from 'react-mdl';


class RecContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.href !== this.props.href) {
      const { dispatch, href } = nextProps;
      dispatch(fetchRecMeta(href));
    }
  }

  render() {
    const { info } = this.props;
    return (
      <Card shadow={0} style={{width: '512px', margin: 'auto'}}>
        <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })} ripple>
          <Tab>Meta</Tab>
          <Tab>Alternatives</Tab>
          <Tab>Software solutions</Tab>
        </Tabs>
        <CardText style={{color: '#000', fontSize: '14px', fontWeight: '100'}}>
          <Rec info={info}  />
        </CardText>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {

  const { href,
    isFetching, info, lastUpdated  } = state.recs;

  return {
    href,
    info,
    isFetching,
    lastUpdated
  }
};

export default connect(mapStateToProps)(RecContainer)
