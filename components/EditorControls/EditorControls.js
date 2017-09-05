import React, {PropTypes} from 'react';
import { connect } from 'react-redux'
import UploadZone from '../UploadZone';

import { Button, Icon, ProgressBar} from 'react-mdl';

import s from './EditorControls.css';
import {decorate} from "../../core/actions/amelietorActions";

class EditorControls extends React.Component {
  constructor(props) {
    super(props);
    const {dispatch} = this.props;
    this.annotate = () => {
      dispatch(decorate());
    };
    this.state = {
      allFetched: true,
      noErrors: true
    }
  }
  componentWillReceiveProps(nextProps){
    let annotations_list = [];
    Object.keys(nextProps.annotations).forEach(function (key) {
      annotations_list.push(nextProps.annotations[key])
    });
    const checkAllFetched = (element, index, array) => {
      return element.isFetching === false;
    };
    const checkNoErrors = (element, index, array) => {
      return element.isError === false;
    };
    this.setState({allFetched:annotations_list.every(checkAllFetched), noErrors:annotations_list.every(checkNoErrors)});
  }
  render() {
    const {allFetched, noErrors} = this.state;
    return (
      <div className={`${s.controls}`}>
        {allFetched && <Button ripple onClick={e => { e.preventDefault(); this.annotate()}}><Icon name="refresh" /> Annotate </Button>}
        {!allFetched && <ProgressBar indeterminate />}
        {!allFetched && <i>Processing... </i> }
        {!noErrors && <Button raised accent ripple> <Icon name="report" /> Errors occurred. Show logs</Button>}
        <UploadZone />
      </div>
    )
  }
}

EditorControls.propTypes = {
  annotations: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  const annotations = state.annotationsByKey;
  return {
    annotations
  }
};

export default connect(mapStateToProps)(EditorControls)
