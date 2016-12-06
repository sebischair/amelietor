import React, { PropTypes, Component} from 'react'
import { connect } from 'react-redux'
import {uploadFile} from '../../core/actions';
import Dropzone from 'react-dropzone'
import s from './UploadZone.css';

class UploadZone extends Component {
  constructor(props) {
    super(props);
    const {dispatch} = this.props;
    this.onDrop = (files) => {
      dispatch(uploadFile(files[0]));
      return true;
    }
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onDrop} className={`${s.uploadzone}`}>
          <div>Try dropping some files here, or click to select files to upload.</div>
        </Dropzone>
      </div>
    )
  }
}

UploadZone.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect() (UploadZone)
