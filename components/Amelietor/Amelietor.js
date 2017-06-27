import React, {PropTypes} from 'react';
let jsSHA = require("jssha");
import {selectRec, fetchAnnotationsPerBlock, selectKey, fetchSession} from '../../core/actions/actions';
import { connect } from 'react-redux'

import { Button, Icon, Textfield, ProgressBar} from 'react-mdl';

import Token from '../Token';
import TokenManager from '../TokenManager/TokenManager'
import RecContainer from '../RecContainer/RecContainer';

import UploadZone from '../UploadZone';

import s from './Amelietor.css';

import {
  Editor,
  EditorState,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  SelectionState,
  Entity,
  Modifier
  } from 'draft-js';

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

class Amelietor extends React.Component {

  constructor(props) {
    super(props);
    const { dispatch } = this.props;
    this.onChange = (editorState) => {
      this.setState({editorState});
    };

    fetchSession();

    const sendRecUrl = (tokenData) =>{
      dispatch(selectRec(tokenData));
    };

    this.focus = () => this.refs.editor.focus();

    const mapDispatchToProps = (dispatch, props) => {
      return {
        onClick: () => {
          sendRecUrl(Entity.get(props.entityKey).getData());
        }
      }
    };

    const ConfiguredToken = connect(
      mapDispatchToProps
    )(Token);

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: ConfiguredToken,
      }
    ]);

    this.getNewDecorators = () => {
      const updated_content = this.state.editorState.getCurrentContent();
      //get document hash
      let shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.update(updated_content.getPlainText());
      let hash = shaObj.getHash("HEX");
      //update fields for saving
      let blocks = convertToRaw(updated_content)['blocks'];
      blocks.map((block, key) => {
          block.paragraphNumber = key;
          block.paragraphsCount = blocks.length;
          block.documentHash = hash;
      });
      blocks.map(block => dispatch(fetchAnnotationsPerBlock(block)));
    };

    const blocks = convertFromRaw(rawContent);

    this.state = {
      loadingStatus: false,
      errorMessage: "",
      editorState: EditorState.createWithContent(blocks, decorator),
    };
  }

  componentWillReceiveProps(nextProps){
    let {editorState} = this.state;

    let onChange = (newState) => {
      this.onChange(newState)
    };
    if (nextProps.content.isFinished && !nextProps.content.isError && this.props.content.lastUpdated != nextProps.content.lastUpdated) {
      const newContent = convertFromRaw(nextProps.content.fileContent);
      let newEditorState = EditorState.push(editorState, newContent, 'change-block-data');
      onChange(newEditorState);
      editorState = newEditorState;
    }

    let findAndDeleteObsoleteAnnotations = (oldAnnotations)=>{
      Object.keys(oldAnnotations).forEach(function (key) {
        let obj = oldAnnotations[key];

        if (!obj.isFetching && !obj.isError){
          obj.items.map(item => {
            let entityKey = Entity.create('TOKEN', 'MUTABLE', item);
            let targetRange = new SelectionState({
              anchorKey: key,
              anchorOffset: item.begin,
              focusKey: key,
              focusOffset: item.end
            });
            let contentWithEntity = Modifier.applyEntity(
              editorState.getCurrentContent(),
              targetRange,
              null
            );
            let newEditorState = EditorState.push(editorState, contentWithEntity, 'apply-entity');
            onChange(newEditorState);
            editorState = newEditorState;
          });
        }
      });
    };

    let oldAnnotations = this.props.annotations;

    findAndDeleteObsoleteAnnotations(oldAnnotations);

    Object.keys(nextProps.annotations).forEach(function (key) {
      let obj = nextProps.annotations[key];

      if (!obj.isFetching && !obj.isError){
        obj.items.map(item => {
          let entityKey = Entity.create('TOKEN', 'MUTABLE', item);
          let targetRange = new SelectionState({
            anchorKey: key,
            anchorOffset: item.begin,
            focusKey: key,
            focusOffset: item.end
          });
          let contentWithEntity = Modifier.applyEntity(
            editorState.getCurrentContent(),
            targetRange,
            entityKey
          );
          let newEditorState = EditorState.push(editorState, contentWithEntity, 'apply-entity');
          onChange(newEditorState);
          editorState = newEditorState;
        });
      }
    });

  }

  render() {
    const checkAllFetched = (element, index, array) => {
      return element.isFetching === false;
    };
    const checkNoErrors = (element, index, array) => {
      return element.isError === false;
    };
    const {selectedAnnotation, annotations} = this.props;
    let annotations_list = [];
    Object.keys(annotations).forEach(function (key) {
      annotations_list.push(annotations[key]);
    });
    const allFetched = annotations_list.every(checkAllFetched);
    const noErrors = annotations_list.every(checkNoErrors);
    return (
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--8-col">
            <Textfield
              onChange={() => {}}
              label="Document name"
              style={{width: '600px'}}
            />
            <div className={`${s.editor}`} onClick={this.focus} style={{heightMin:'600px'}}>
              <Editor
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
                ref="editor"
                spellCheck={true}
              />
            </div>
            {allFetched && <Button ripple onClick={this.getNewDecorators}><Icon name="refresh" /> Annotate </Button> }
            {!allFetched && <ProgressBar indeterminate />}
            {!allFetched && <i>Processing... </i> }
            {!noErrors && <Button raised accent ripple> <Icon name="report" /> Errors occurred. Show logs</Button>}
            <UploadZone />
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            {selectedAnnotation && <TokenManager blocks={convertToRaw(this.state.editorState.getCurrentContent())['blocks']}/>}
            <br/>
            {selectedAnnotation && <RecContainer />}
          </div>
        </div>
    );
  }
}

function getEntityStrategy(mutability) {
  return function(contentBlock, callback) {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return Entity.get(entityKey).getMutability() === mutability;
      },
      callback
    );
  };
}


Amelietor.propTypes = {
  selectedAnnotation: PropTypes.string,
  annotations: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const annotations = state.annotationsByKey;
  const selectedAnnotation = state.recs.href;
  const content = state.content;
  return {annotations, selectedAnnotation, content};

}

export default connect(mapStateToProps)(Amelietor);

