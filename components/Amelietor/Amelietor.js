import React, {PropTypes} from 'react';
let jsSHA = require("jssha");
import {
  selectRec, clearRec, fetchAnnotationsPerBlock, selectKey, fetchSession,
  invalidateAnnotation
} from '../../core/actions/actions';
import {connect} from 'react-redux'

import {Textfield} from 'react-mdl';

import Token from '../Token';

import s from './Amelietor.css';

import {
  Editor,
  EditorState,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  SelectionState,
  Modifier,
  ContentState
  } from 'draft-js';
import {decorate, decorationFailed, decorationSucceed} from "../../core/actions/amelietorActions";

class Amelietor extends React.Component {

  constructor(props) {
    super(props);
    const { dispatch, content } = this.props;
    this.onChange = (editorState) => {
      this.setState({editorState});
    };

    dispatch(fetchSession());

    const sendRecUrl = (tokenData) =>{
      dispatch(selectRec(tokenData));
    };

    this.focus = () => this.refs.editor.focus();

    const mapDispatchToProps = (dispatch, props) => {
      return {
        data: this.state.editorState.getCurrentContent().getEntity(props.entityKey).getData(),
        onClick: () => {
          sendRecUrl(this.state.editorState.getCurrentContent().getEntity(props.entityKey).getData());
        }
      }
    };

    const ConfiguredToken = connect(mapDispatchToProps)(Token);

    const decorator = new CompositeDecorator([
      {
        strategy: (
          contentBlock,
          callback,
          contentState
        ) => getEntityStrategy(contentBlock, callback, contentState),
        component: ConfiguredToken,
      }
    ]);

    this.invalidateAnnotations = (editorState) => {
      const updated_content = this.state.editorState.getCurrentContent();
      let blocks = convertToRaw(updated_content)['blocks'];
      blocks.map((block, key) => {
        block.paragraphNumber = key;
        block.paragraphsCount = blocks.length;
      });
      blocks.filter(block => {if (block.text.length >0) return block} ).map(block => dispatch(invalidateAnnotation(block.key)));
    };

    this.getNewDecorators = (editorState) => {

      const updated_content = this.state.editorState.getCurrentContent();
      //get document hash
      //let shaObj = new jsSHA("SHA-1", "TEXT");
      //shaObj.update(updated_content.getPlainText());
      //let hash = shaObj.getHash("HEX");
      //update fields for saving
      let blocks = convertToRaw(updated_content)['blocks'];
      blocks.map((block, key) => {
          block.paragraphNumber = key;
          block.paragraphsCount = blocks.length;
          //block.documentHash = hash;
      });
      blocks.filter(block => {if (block.text.length >0) return block} ).map(block => dispatch(fetchAnnotationsPerBlock(block)));
      this.setState({decorated:true});
      dispatch(decorationSucceed());
    };

    const editorState = this.props.initialContent? EditorState.createWithContent(convertFromRaw(this.props.initialContent), decorator): EditorState.createEmpty(decorator);
    
    this.state = {
      triggerOnLoad: this.props.triggerOnLoad || false,
      editorState: editorState,
      decorated:false,
      invalidAnnotations:false,
    };
  }
  componentDidMount(){
    if (this.state.triggerOnLoad){
      this.props.dispatch(decorate());
    }
  }

  componentWillUnmount(){
    this.setState({decorated:false});
    this.invalidateAnnotations(this.state.editorState);
    this.props.dispatch(clearRec(null));
  }

  componentWillReceiveProps(nextProps){
    let {editorState} = this.state;

    let onChange = (newState) => {
      this.onChange(newState)
    };
    if (nextProps.amelietorReducer.decorate && !this.props.amelietorReducer.decorate){
      //this.invalidateAnnotations(editorState);

      this.getNewDecorators(editorState);
    }

    if (nextProps.content.isFinished && !nextProps.content.isError &&
      this.props.content.lastUpdated !== nextProps.content.lastUpdated) {
        const newContent = convertFromRaw(nextProps.content.fileContent);
        let newEditorState = EditorState.push(editorState, newContent, 'change-block-data');
        onChange(newEditorState);
        editorState = newEditorState;
        this.invalidateAnnotations();
    }
    else {
      this.findAndDeleteObsoleteAnnotations = (oldAnnotations) => {
        Object.keys(oldAnnotations).forEach(function (key) {
          let obj = oldAnnotations[key];
          if (!obj.isFetching && !obj.isError && !obj.isInvalid) {

            obj.items.map(item => {
              editorState.getCurrentContent().createEntity('TOKEN', 'MUTABLE', item);
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

      this.findAndDeleteObsoleteAnnotations(this.props.annotations);

      Object.keys(nextProps.annotations).forEach(function (key) {
        let obj = nextProps.annotations[key];
        if (!obj.isFetching && !obj.isError && !obj.isInvalid) {
          obj.items.map(item => {
            const contentStateWithEntity = editorState.getCurrentContent().createEntity('TOKEN', 'MUTABLE', item);
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
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

  }

  render() {
    return (
            <div className={`${s.editor}`} onClick={this.focus}>
              <Editor
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
                ref="editor"
                readOnly={this.props.readOnly || false}
                spellCheck={true}
              />
            </div>
    );
  }
}

const getEntityStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity();
        if (entityKey === null) {
          return false;
        }
        return contentState.getEntity(entityKey).getMutability() === 'MUTABLE';
      },
      callback
    );
};

Amelietor.propTypes = {
  selectedAnnotation: PropTypes.string,
  annotations: PropTypes.object.isRequired,
  amelietorReducer: PropTypes.object.isRequired,
  triggerOnLoad: PropTypes.bool,
  initialContent: PropTypes.object,
  readOnly: PropTypes.bool,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const annotations = state.annotationsByKey;
  const selectedAnnotation = state.recs.token;
  const content = state.content;
  const amelietorReducer = state.amelietorReducer;
  return {annotations, selectedAnnotation, content, amelietorReducer};
}

export default connect(mapStateToProps)(Amelietor);

