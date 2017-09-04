import React, { PropTypes, Component} from 'react'

class Meta extends Component {

  constructor(props) {
    super(props);

  }

  render(){
    const {info} = this.props  ;
    return (
        <section>
          <div className="content">{info.data || "No meta"}</div>
        </section>
    )
  };
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


