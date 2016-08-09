import React, { PropTypes, Component} from 'react'
import ReactDOM from 'react-dom';

import s from './Rec.css';

export default class Rec extends Component {

  render(){

    return (
      <div className={`demo-card-square mdl-card mdl-shadow--2dp ${s.recommendation}`}>
        <div className="mdl-card__supporting-text">
          {props.info}
        </div>
        <div className="mdl-card__actions mdl-card--border">
          <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Details
          </a>
        </div>
      </div>
    )
  };
}

Rec.propTypes = {
//  href: PropTypes.string.isRequired,
  info: PropTypes.string.isRequired,
//  isFetching: PropTypes.bool.isRequired,
//  lastUpdated: PropTypes.number,
//  dispatch: PropTypes.func.isRequired
};



//class Rec extends React.Component {
//
//  constructor(props) {
//    super(props);
//    console.log(props);
//  }
//
//
//  render() {
//    return (
//        <div className={`demo-card-square mdl-card mdl-shadow--2dp ${s.recommendation}`}>
//          <div className="mdl-card__supporting-text">
//
//          </div>
//          <div className="mdl-card__actions mdl-card--border">
//            <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.logState}>
//              Details
//            </a>
//          </div>
//        </div>
//    );
//  }
//}
//
//Rec = connect()(Rec);
//
//export default Rec;
//
