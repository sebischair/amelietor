import React, {PropTypes} from 'react';
let jsSHA = require("jssha");
import {selectRec, fetchAnnotationsPerBlock, selectKey, fetchSession} from '../../core/actions/actions';
import {connect} from 'react-redux'

import {Textfield} from 'react-mdl';

import Amelietor from '../Amelietor';
import TokenManager from '../TokenManager'
import RecContainer from '../RecContainer';
import EditorControls from '../EditorControls'

import s from './ExampleEditor.css';

const rawContent = {
  blocks: [
    {
      text: (
        'The Yummy Inc online application will be deployed onto a ' +
        'J2EE application server Websphere Application Server version 6, ' +
        'as it is already the application server use for internal applications.'
      ),
      type: 'unstyled',
    },
    {
      text: '',
      type: 'unstyled',
    },
    {
      text: (
        'J2EE security model will be reused. ' +
        'Data persistence will be addressed using a relational database.'
      ),
      type: 'unstyled'
    },
    {
      text: '',
      type: 'unstyled',
    },
  ],
  entityMap: {
  },
};

class ExampleEditor extends React.Component {

  constructor(props) {
    super(props);
  };

  render() {
    return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--8-col">
            <Textfield
              className={`${s.textfield}`}
              onChange={() => {}}
              label="Document name"
            />
            <Amelietor initialContent={rawContent} />
          </div>
          <EditorControls />
          <div className={`mdl-cell mdl-cell--4-col ${s.recommendations}`}>
            <TokenManager/>
            <br/>
            <RecContainer />
          </div>
        </div>
    );
  }
}

export default ExampleEditor;

