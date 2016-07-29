import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import Rec from '../Rec';
import s from './Amelietor.css';
import {
  Editor,
  EditorState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
  ContentState,
  Entity
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
      entityRanges: [{offset: 4, length: 9, key: 'first'}, {offset: 57, length: 4, key: 'second'} ],
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
      entityRanges: [{offset: 0, length: 4, key: 'second'}, {offset: 79, length: 19, key: 'third'}],
    },
    {
      text: '',
      type: 'unstyled',
    },
  ],

  entityMap: {
    first: {
      type: 'TOKEN',
      mutability: 'IMMUTABLE',
      data: {'href':"http://dbpedia.org/page/MSQL"}

    },
    second: {
      type: 'TOKEN',
      mutability: 'MUTABLE',
      data: {'href':"http://dbpedia.org/page/MSQL"}
    },
    third: {
      type: 'TOKEN',
      mutability: 'SEGMENTED',
      data: {'href':"http://dbpedia.org/page/Relational_database"}
    },
  },
};

class Amelietor extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = (editorState) => this.setState({editorState});
    this.focus = () => this.refs.editor.focus();

    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };

    this.onTokenClick = (data) => {
      this.setState({
        suggestions: data,
      });
    };



    const blocks = convertFromRaw(rawContent);

    const decorator = new CompositeDecorator([
      {
        strategy: getEntityStrategy('IMMUTABLE'),
        component: TokenSpan,
      },
      {
        strategy: getEntityStrategy('MUTABLE'),
        component: TokenSpan,
      },
      {
        strategy: getEntityStrategy('SEGMENTED'),
        component: TokenSpan,
      },
    ]);

    this.state = {
      editorState: EditorState.createWithContent(blocks, decorator),
    };
  }


  render() {
    const {editorState} = this.state;
    return (
      <div>
        <div className="mdl-grid">
          <div className="mdl-cell mdl-cell--8-col">
            <div className={`${s.editor}`}>
                <Editor
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  ref="editor"
                  spellCheck={true}
                />
            </div>
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            <Rec
              ref="rec"
              suggestions = {this.state.suggestions}
            />
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

function getDecoratedStyle(mutability) {
  switch (mutability) {
    case 'IMMUTABLE': return styles.immutable;
    case 'MUTABLE': return styles.mutable;
    case 'SEGMENTED': return styles.segmented;
    default: return null;
  }
}

const TokenSpan = (props) => {
  const style = getDecoratedStyle(
    Entity.get(props.entityKey).getMutability()
  );
  const data = Entity.get(props.entityKey).getData();
  return (
    <span {...props} style={style} onClick={props.onTokenClick(data)}>
            {props.children}
    </span>

  );
};

const styles = {
  root: {
    fontFamily: '\'Helvetica\', sans-serif',
    padding: 20,
    width: 600,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  immutable: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '2px 0',
  },
  mutable: {
    backgroundColor: 'rgba(204, 204, 255, 1.0)',
    padding: '2px 0',
  },
  segmented: {
    backgroundColor: 'rgba(248, 222, 126, 1.0)',
    padding: '2px 0',
  },
};


export default Amelietor;

