import React, { PropTypes, Component} from 'react'
import ReactDOM from 'react-dom';

import s from './Alternatives.css';

class Alternatives extends Component {

  constructor(props) {
    super(props);

  }

  render(){
    const {alternatives} = this.props;
    return (
        <section>
          <div className="content">
            <ul>
              {alternatives.data.map((alt, i) =>
                  <li key={i}><a href={alt.url}>{alt.title}</a></li>
              )}
            </ul>
          </div>
        </section>
    )
  };
}

Alternatives.propTypes = {
  alternatives: PropTypes.shape({
    data: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number.isRequired
  }).isRequired

};

export default Alternatives;


