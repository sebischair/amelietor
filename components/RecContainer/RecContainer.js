import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { fetchRecMeta, fetchRecAlternatives, fetchRecSoftware } from '../../core/actions/actions';
import Meta from '../Meta';
import Alternatives from '../Alternatives';
import { Card, CardText, Tab, Tabs, Spinner } from 'react-mdl';
import s from './RecContainer.css';

class RecContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { activeTab: 0 };

    this.isVisible = id => {
      return this.state.activeTab === id;
    };
  }

  componentDidMount() {
    const { dispatch, tokenData } = this.props;
    if (tokenData.URI) {
      dispatch(fetchRecMeta(tokenData.URI));
      dispatch(fetchRecAlternatives(tokenData.URI));
      dispatch(fetchRecSoftware(tokenData.URI));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tokenData !== this.props.tokenData) {
      const { dispatch, tokenData } = nextProps;
      dispatch(fetchRecMeta(tokenData.URI));
      dispatch(fetchRecAlternatives(tokenData.URI));
      dispatch(fetchRecSoftware(tokenData.URI));
    }
  }

  render() {
    const { tokenData, info, alternatives, software } = this.props;
    if (!tokenData.URI) {
      return <div />;
    }
    return (
      <div>
        <Card shadow={0} className={`${s.card}`}>
          <Tabs activeTab={this.state.activeTab} onChange={tabId => this.setState({ activeTab: tabId })}>
            <Tab>Meta {info.isFetching && <Spinner singleColor className={`${s.spinner}`} />}</Tab>
            <Tab>Alternatives {alternatives.isFetching && <Spinner singleColor className={`${s.spinner}`} />}</Tab>
            <Tab>
              Software solutions {alternatives.isFetching && <Spinner singleColor className={`${s.spinner}`} />}
            </Tab>
          </Tabs>
          <CardText className={`${s.cardText}`}>
            {this.isVisible(0) && !info.isFetching && <Meta info={info} />}
            {this.isVisible(1) &&
              !alternatives.isFetching && (
                <Alternatives type="alternative" alternatives={alternatives} href={tokenData.URI} />
              )}
            {this.isVisible(2) &&
              !software.isFetching && <Alternatives type="software" alternatives={software} href={tokenData.URI} />}
          </CardText>
        </Card>
        <br />
        <br />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { token, info, alternatives, software, tokenData } = state.recs;

  return {
    token,
    info,
    alternatives,
    software,
    tokenData
  };
};

export default connect(mapStateToProps)(RecContainer);
