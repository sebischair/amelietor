import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import {fetchRecMeta, fetchRecAlternatives, fetchRecSoftware} from '../../core/actions';
import Meta from '../Meta'
import Alternatives from '../Alternatives'
import { Card, CardText, Tab, Tabs } from 'react-mdl';


class RecContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 0 };

    this.isVisible = (id) => {
      return this.state.activeTab == id;
    };

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.href !== this.props.href) {
      const { dispatch, href } = nextProps;
      dispatch(fetchRecMeta(href));
      dispatch(fetchRecAlternatives(href));
      dispatch(fetchRecSoftware(href));
    }
  }

  render() {
    const { info, alternatives, software } = this.props;
    return (
      <Card shadow={0} style={{width: '512px', margin: 'auto'}}>
        <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })}>
          <Tab>Meta</Tab>
          <Tab>Alternatives</Tab>
          <Tab>Software solutions</Tab>
        </Tabs>
        <CardText style={{color: '#000', fontSize: '14px', fontWeight: '100'}}>
          {this.isVisible(0) && <Meta info={info} /> }
          {this.isVisible(1) && <Alternatives alternatives={alternatives} /> }
          {this.isVisible(2) && <Alternatives alternatives={software} /> }
        </CardText>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {

  const { href,
    info,
    alternatives,
    software
  } = state.recs;

  return {
    href,
    info,
    alternatives,
    software
  }
};

export default connect(mapStateToProps)(RecContainer)
