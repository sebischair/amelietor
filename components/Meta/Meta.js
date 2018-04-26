import React, { PropTypes, Component } from 'react';

class Meta extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleRow = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    const { info } = this.props;
    // Display at most 250 characters. Click on 'show more' to see full text.
    const limit = 250;
    const meta = info.data ? info.data : 'No meta information available.';
    let metaDiv;
    if (meta.length > limit) {
      metaDiv = (
        <div className="content">
          {this.state.open ? meta : meta.slice(0, limit).concat('... ')}
          <a href="#" onClick={this.toggleRow}>
            {this.state.open ? 'Show less' : 'Show more'}
          </a>
        </div>
      );
    } else {
      metaDiv = <div className="content">{meta}</div>;
    }
    return <section>{metaDiv}</section>;
  }
}

Meta.propTypes = {
  info: PropTypes.shape({
    data: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number
  }).isRequired
};

export default Meta;
