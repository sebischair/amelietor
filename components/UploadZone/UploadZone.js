import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

import { uploadFile } from '../../core/actions/actions';
import s from './UploadZone.css';

class UploadZone extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.onDrop = files => {
      dispatch(uploadFile(files[0]));
      return true;
    };
  }

  render() {
    return (
      <div>
        <Dropzone onDrop={this.onDrop} className={`${s.uploadzone}`}>
          <h4>Upload area</h4>
          <div>Drop some files here, or click and select files to upload</div>
        </Dropzone>
      </div>
    );
  }
}

UploadZone.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(UploadZone);
