import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Textfield} from 'react-mdl';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject, fetchERData} from '../../core/actions/scactions';
import history from '../../src/history';
import s from './Experts.css';
import {Spinner} from 'react-mdl';

class Experts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchString: ""};
    let projectKey = this.props.projectKey === undefined ? HelperFunctions.getParameterByName("projectKey", history.location.search) : this.props.projectKey;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectKey));
    }

    if(this.props.erData.length === 0) {
      this.props.dispatch(fetchERData(projectKey));
    }
  }

  handleChange = (event) => {
    this.setState({searchString: event.target.value});
  };

  render() {
    let adds = this.props.erData.filter(e => {
      if(e.predictions) return e.predictions.length > 0;
      else return false;
    });
    let searchString = this.state.searchString.trim().toLowerCase();
    if (searchString.length > 0) {
      adds = adds.filter(add => {
        return (add.text.toLowerCase().indexOf(searchString) !== -1);
      });
    }

    //TODO: Unable to set the width of columns
    return (
      <div>
        <Textfield value={this.state.searchString} onChange={this.handleChange} label="Search..."
                   style={{width: '400px'}}/>

        <div style={{'textAlign': 'center'}}> {adds.length === 0 && <Spinner /> } </div>

        <table className={`mdl-data-table mdl-js-data-table mdl-shadow--2dp ${s.customWidth}`}>
          <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric"><b>Open Design Decisions</b></th>
            <th><b>Experts Recommendation</b></th>
          </tr>
          </thead>
          <tbody>
            {adds.map(function(add, i){
              return <tr key={i}>
                <td className={`mdl-data-table__cell--non-numeric ${s.customWidthTR}`}>{ add.text }</td>
                <td>
                  {add.predictions.map(function(pre, j) {
                    return <p key={j}>{pre.personName} -- {pre.score}</p>
                  })}
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {selectedProject, erData} = state.screcs;
  return {selectedProject, erData};
};

Experts.propTypes = {
  erData: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Experts);
