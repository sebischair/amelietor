import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import {Table, TableHeader, Textfield} from 'react-mdl';
import HelperFunctions from '../HelperFunctions';
import {fetchSelctedProject} from '../../core/actions/scactions';
import history from '../../src/history';
import edata from './data.json';
import s from './Experts.css';

class Experts extends React.Component {
  constructor(props) {
    super(props);
    let experts = edata.filter(e => {
      return e.predictions.length > 0;
    });
    this.state = {data: experts, searchString: ""};
    let projectId = this.props.projectId === undefined ? HelperFunctions.getParameterByName("id", history.location.search) : this.props.projectId;
    if (Object.keys(this.props.selectedProject).length === 0 && this.props.selectedProject.constructor === Object) {
      this.props.dispatch(fetchSelctedProject(projectId));
    }
  }

  handleChange = (event) => {
    this.setState({searchString: event.target.value});
  };

  render() {
    let adds = this.state.data;
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
  const {selectedProject} = state.screcs;
  return {selectedProject};
};

Experts.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect(mapStateToProps)(Experts);
