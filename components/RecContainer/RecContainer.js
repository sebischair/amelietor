import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import Rec from '../Rec'


class RecContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.href !== this.props.href) {
      const { dispatch, href } = nextProps;
      dispatch(fetchMeta(href))
    }
  }

  render() {
    const { info } = this.props;

    return (
      <Rec info={info} />
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
