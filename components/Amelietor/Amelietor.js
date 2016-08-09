import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import {selectRec, fetchAnnotationsPerBlock, selectKey} from '../../core/actions';
import { connect } from 'react-redux'

//TODO: Clean up imports
//import store from '../../core/store';
import Rec from '../Rec';
import Token from '../Token';
import RecContainer from '../RecContainer/RecContainer';
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

    dispatch(selectRec("Click on annotation to see a hint"));
    this.onChange = (editorState) => {
      this.setState({editorState});
    };

    const sendRecUrl = (url) =>{
      dispatch(selectRec(url));
    };

    this.focus = () => this.refs.editor.focus();

    const mapDispatchToProps = (dispatch, props) => {
      return {
        onClick: () => {
          sendRecUrl(Entity.get(props.entityKey).getData().href);
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
      convertToRaw(updated_content)['blocks'].map(block => dispatch(fetchAnnotationsPerBlock(block)));
    };

    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
      const { annotations } = this.props;
      let {editorState} = this.state;
      let onChange = (newState) => {
        console.log(newState);
        this.onChange(newState)
      };
      Object.keys(annotations).forEach(function (key) {
        let obj = annotations[key];
        obj.items.map(item => {
          console.log(item);
          let entityKey = Entity.create('TOKEN', 'MUTABLE', {href: item.URI});
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
      });
    };

    const blocks = convertFromRaw(rawContent);

    this.state = {
      editorState: EditorState.createWithContent(blocks,decorator),
    };

  }

  render() {
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
            <div className="mdl-grid">
              <div className="mdl-cell mdl-cell--12-col">
                <input
                  onClick={this.getNewDecorators}
                  className={`mdl-button mdl-js-button mdl-button--accent ${s.button}`}
                  type="button"
                  value="Update decorators"
                />
                <input
                  onClick={this.logState}
                  className={`mdl-button mdl-js-button mdl-button--accent ${s.button}`}
                  type="button"
                  value="Show decorators"
                />
              </div>
            </div>
          </div>
          <div className="mdl-cell mdl-cell--4-col">
            <RecContainer />
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


Amelietor.propTypes = {
  //blockKey: PropTypes.string.isRequired,
  annotations: PropTypes.object.isRequired,
  //isFetching: PropTypes.bool.isRequired,
  //lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const annotations = state.rootAnnotationsReducer.annotationsByKey;
  return {annotations};

}

export default connect(mapStateToProps)(Amelietor);

