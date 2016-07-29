import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import s from './Rec.css';


class Rec extends React.Component {

  constructor(props) {
    super(props);

    this.state = {recState:{}};

    this.onChange = (recState) => this.setState({recState});



    this.logState = () => {
      const content = this.state.recState;
      console.log(content);
    };


  }


  render() {
    return (
        <div className={`demo-card-square mdl-card mdl-shadow--2dp ${s.recommendation}`}>
          <div className="mdl-card__supporting-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Aenan convallis.
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <a className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" onClick={this.logState}>
              Details
            </a>
          </div>
        </div>
    );
  }
}


export default Rec;

