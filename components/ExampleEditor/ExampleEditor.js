import React, { PropTypes } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';

import Amelietor from '../Amelietor';
import TokenManager from '../TokenManager';
import RecContainer from '../RecContainer';
import EditorControls from '../EditorControls';
import s from './ExampleEditor.css';

const styles = {
  gridContainer: {
    margin: '16px'
  },
  textField: {
    width: '600px',
    margin: '15px 0 30px 0'
  }
};

const rawContent = {
  blocks: [
    {
      text:
        'The Yummy Inc online application will be deployed onto a ' +
        'J2EE application server Websphere Application Server version 6, ' +
        'as it is already the application server use for internal applications.',
      type: 'unstyled'
    },
    {
      text: '',
      type: 'unstyled'
    },
    {
      text: 'J2EE security model will be reused. ' + 'Data persistence will be addressed using a relational database.',
      type: 'unstyled'
    },
    {
      text: '',
      type: 'unstyled'
    }
  ],
  entityMap: {}
};

class ExampleEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container className={this.props.classes.gridContainer}>
        <Grid item xs={7}>
          <TextField className={this.props.classes.textField} onChange={() => {}} label="Document name" />
          <Amelietor initialContent={rawContent} />
          <EditorControls hasUploadButton={true} />
        </Grid>
        <Grid item xs={7} className={s.recommendations}>
          <TokenManager />
          <RecContainer />
        </Grid>
      </Grid>
    );
  }
}

ExampleEditor.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles)(ExampleEditor);
