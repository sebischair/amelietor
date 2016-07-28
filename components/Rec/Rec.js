import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import s from './Rec.css';


class Rec extends React.Component {

  constructor(props) {
    super(props);

    //this.onChange = (recState) => this.setState({recState});
    //this.focus = () => this.refs.rec.focus();


  }


  render() {
    return (
      <div>
        <div className={`${s.recommendation}`}>
          <p>Reccomendation</p>
        </div>
      </div>
    );
  }
}


export default Rec;

