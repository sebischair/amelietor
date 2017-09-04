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
    }
  }

  render() {
    return (
      <div className={`${s.controls}`}>
        {/*{allFetched && <Button ripple onClick={this.getNewDecorators}><Icon name="refresh" /> Annotate </Button> }*/}
        <Button ripple onClick={e => { e.preventDefault(); this.annotate()}}><Icon name="refresh" /> Annotate </Button>
        {/*{!allFetched && <ProgressBar indeterminate />}*/}
        {/*{!allFetched && <i>Processing... </i> }*/}
        {/*{!noErrors && <Button raised accent ripple> <Icon name="report" /> Errors occurred. Show logs</Button>}*/}
        <UploadZone />
      </div>
    )
  }
}


EditorControls.propTypes = {
  blocks: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
  const { tokenData } = state.recs ;

  const { amelietorReducer } = state.amelietorReducer;

  return {
    tokenData,
    amelietorReducer
  }
};

export default connect(mapStateToProps)(EditorControls)
