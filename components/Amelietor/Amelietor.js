import React, {PropTypes} from 'react';
let jsSHA = require("jssha");
import {selectRec, fetchAnnotationsPerBlock, selectKey, fetchSession} from '../../core/actions/actions';
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
  Entity,
  Modifier
  } from 'draft-js';
import {decorate, decorationFailed, decorationSucceed} from "../../core/actions/amelietorActions";

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
    const { dispatch, content } = this.props;
    this.onChange = (editorState) => {
      this.setState({editorState});
    };

    // fetchSession();

    const sendRecUrl = (tokenData) =>{
      dispatch(selectRec(tokenData));
    };

    this.focus = () => this.refs.editor.focus();

    const mapDispatchToProps = (dispatch, props) => {
      return {
        data: Entity.get(props.entityKey).getData(),
        onClick: () => {
          sendRecUrl(Entity.get(props.entityKey).getData());
        }
      }
    };

    const ConfiguredToken = connect(mapDispatchToProps)(Token);

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: ConfiguredToken,
      }
    ]);

    this.getNewDecorators = () => {
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
    };

    const blocks = content.fileContent? content.fileContent.length === 0? convertFromRaw(rawContent): convertFromRaw(content.fileContent):convertFromRaw(rawContent);

    this.state = {
      triggerOnLoad: this.props.triggerOnLoad | false,
      loadingStatus: false,
      errorMessage: "",
      editorState: EditorState.createWithContent(blocks, decorator),
    };
  }
  componentDidMount(){
    if (this.state.triggerOnLoad){
      this.props.dispatch(decorate());
    }
  }

  componentWillReceiveProps(nextProps){
    let {editorState} = this.state;

    let onChange = (newState) => {
      this.onChange(newState)
    };
    if (nextProps.amelietorReducer.decorate && !this.props.amelietorReducer.decorate){
      this.getNewDecorators();
    }
    if (nextProps.content.isFinished && !nextProps.content.isError &&
      this.props.content.lastUpdated !== nextProps.content.lastUpdated) {
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
            Entity.create('TOKEN', 'MUTABLE', item);
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
    return (
            <div className={`${s.editor}`} onClick={this.focus}>
              <Editor
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
                ref="editor"
                readOnly={this.props.content.readOnly}
                spellCheck={true}
              />
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
  amelietorReducer: PropTypes.object.isRequired,
  triggerOnLoad: PropTypes.bool,
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

