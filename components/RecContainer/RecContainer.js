import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import {fetchRecMeta, fetchRecAlternatives, fetchRecSoftware} from '../../core/actions';
import Meta from '../Meta'
import Alternatives from '../Alternatives'
import { Card, CardText, Tab, Tabs, Spinner } from 'react-mdl';


class RecContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 0 };

    this.isVisible = (id) => {
      return this.state.activeTab == id;
    };

  }

  componentDidMount() {
    const { dispatch, href } = this.props;
    dispatch(fetchRecMeta(href));
    dispatch(fetchRecAlternatives(href));
    dispatch(fetchRecSoftware(href));
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
    const { href, info, alternatives, software } = this.props;
    return (
      <Card shadow={0} style={{width: '512px', margin: 'auto'}}>
        <Tabs activeTab={this.state.activeTab} onChange={(tabId) => this.setState({ activeTab: tabId })}>
          <Tab>Meta {info.isFetching && <Spinner singleColor style={{ width: '14px', height: '14px', marginTop: '14px', lineHeight: '0px'}} />}</Tab>
          <Tab>Alternatives {alternatives.isFetching && <Spinner singleColor style={{ width: '14px', height: '14px', marginTop: '14px', lineHeight: '0px'}}/>}</Tab>
          <Tab>Software solutions {alternatives.isFetching && <Spinner singleColor style={{ width: '14px', height: '14px', marginTop: '14px', lineHeight: '0px'}}/>}</Tab>
        </Tabs>
        <CardText style={{color: '#000', fontSize: '14px', fontWeight: '100'}}>
          {this.isVisible(0) && !info.isFetching && <Meta info={info} /> }
          {this.isVisible(1) && !alternatives.isFetching && <Alternatives type="alterantive" alternatives={alternatives} href={href}/> }
          {this.isVisible(2) && !software.isFetching && <Alternatives type="software" alternatives={software} href={href}/> }
        </CardText>
      </Card>
    )
  }
}

const mapStateToProps = (state) => {

  const {
    href,
    info,
    alternatives,
    software
  } = state.recs || { info:{isFetching:true, data:""}, alternatives:{isFetching:true, data:[]}, software:{isFetching:true, data:[]} };

  return {
    href,
    info,
    alternatives,
    software
  }
};

export default connect(mapStateToProps)(RecContainer)
