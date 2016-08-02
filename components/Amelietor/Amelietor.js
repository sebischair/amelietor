import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import {showRec} from '../../core/actions';
import { connect } from 'react-redux'
import store from '../../core/store';
import Rec from '../Rec';
import Token from '../Token';
import CurRec from '../CurRec';
import s from './Amelietor.css';
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState,
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
      entityRanges: [{offset: 4, length: 9, key: "first"}, {offset: 57, length: 4, key: 2} ],
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
      type: 'unstyled',
      entityRanges: [{offset: 0, length: 4, key: 3}, {offset: 79, length: 19, key: 3}],
    },
    {
      text: '',
      type: 'unstyled',
    },
  ],

  entityMap: {
    "first": {
      type: 'TOKEN',
      mutability: 'MUTABLE',
      data: {'href':"http://dbpedia.org/page/MSQL"}

    },
    2: {
      type: 'TOKEN',
      mutability: 'MUTABLE',
      data: {'href':"http://dbpedia.org/page/MSQL"}
    },
    3: {
      type: 'TOKEN',
      mutability: 'MUTABLE',
      data: {'href':"http://dbpedia.org/page/Relational_database"}
    },
  },
};

class Amelietor extends React.Component {

  constructor(props) {
    super(props);
    store.dispatch(showRec("Click on annotation to see a hint"));
    this.onChange = (editorState) => {
      this.setState({editorState});

    };

    this.focus = () => this.refs.editor.focus();

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: ConfiguredToken,
      }
    ]);

    this.getNewDecorators = () => {

      const entityKey = Entity.create('TOKEN', 'MUTABLE', {href: 'http://www.zombo.com'});
      const selection = this.state.editorState.getSelection();
      const targetRange = new SelectionState({
        anchorKey: selection.getAnchorKey(),
        anchorOffset: 40,
        focusKey: selection.getAnchorKey(),
        focusOffset: 48
      });
      console.log(targetRange);
      const contentWithEntity = Modifier.applyEntity(
        this.state.editorState.getCurrentContent(),
        targetRange,
        entityKey
      );
      console.log(convertToRaw(contentWithEntity));
      this.state.editorState = EditorState.push(this.state.editorState, contentWithEntity, 'apply-entity');
      const newEditorState = EditorState.set(this.state.editorState, {decorator: decorator});
      this.setState({newEditorState});
      //this.state.editorState = EditorState.createWithContent(this.state.editorState.getCurrentContent(), decorator);
    };

    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };

    const blocks = convertFromRaw(rawContent);
    console.log(blocks);

    this.state = {
      editorState: EditorState.createWithContent(blocks),
    };

  }


  render() {
    //const {editorState} = this.state;
    return (
      <div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--8-col">
            <div className={`${s.editor}`} onClick={this.focus}>
                <Editor
                  editorState={this.state.editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  ref="editor"
                  spellCheck={true}
                />
            </div>
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            <CurRec href = ''/>
          </div>
        </div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--12-col">
            <input
                onClick={this.logState}
                className={`mdl-button mdl-js-button mdl-button--accent ${s.button}`}
                type="button"
                value="Log State"
            />
            <input
              onClick={this.getNewDecorators}
              className={`mdl-button mdl-js-button mdl-button--accent ${s.button}`}
              type="button"
              value="Update decorators"
            />
          </div>
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


const mapDispatchToProps = (dispatch, props) => {
  return {
    onClick: () => {
      store.dispatch(showRec(Entity.get(props.entityKey).getData().href));
      console.log(store.getState());
    }
  }
}

const ConfiguredToken = connect(
  mapDispatchToProps
)(Token)


export default Amelietor;

