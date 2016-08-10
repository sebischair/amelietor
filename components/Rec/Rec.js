import React, { PropTypes, Component} from 'react'
import ReactDOM from 'react-dom';



import s from './Rec.css';

export default class Rec extends Component {

  constructor(props) {
    super(props)


  }

  render(){
    return (
          <section>
            <div className="content">{this.props.info}</div>
          </section>
    )
  };
}

Rec.propTypes = {
  info: PropTypes.string.isRequired,
};


//<div className={`demo-card-square mdl-card mdl-shadow--2dp ${s.recommendation}`}>
//  <div className="mdl-card__supporting-text">
//    {this.props.info}
//  </div>
//  <div className="mdl-card__actions mdl-card--border">
//    <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
//      Details
//    </a>
//  </div>
//</div>

