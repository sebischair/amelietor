import React, { PropTypes, Component} from 'react'
import ReactDOM from 'react-dom';

import s from './Meta.css';

class Meta extends Component {

  constructor(props) {
    super(props);

  }

  render(){
    const {info} = this.props  ;
    return (
        <section>
          <div className="content">{info.data || "Click on annotation"}</div>
        </section>
    )
  };
}

Meta.propTypes = {
  info: PropTypes.shape({
    data: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired
  }).isRequired

};

export default Meta;


