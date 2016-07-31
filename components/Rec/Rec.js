import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom';
import { connect } from 'react-redux'
import store from '../../core/store'
import s from './Rec.css';

let Rec = ({href}) => {
  return (
  <div className={`demo-card-square mdl-card mdl-shadow--2dp ${s.recommendation}`}>
    <div className="mdl-card__supporting-text">
      {href}
    </div>
    <div className="mdl-card__actions mdl-card--border">
      <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
        Details
      </a>
    </div>
  </div>
)};

Rec.propTypes = {
  href: PropTypes.string.isRequired
};

Rec = connect()(Rec);

export default Rec


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
