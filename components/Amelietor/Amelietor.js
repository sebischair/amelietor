import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';
import s from './Amelietor.css';
import {Editor, EditorState, RichUtils } from 'draft-js';

class Amelietor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.focus = () => this.refs.editor.focus();

  }

  //componentDidMount() {
  //  window.componentHandler.upgradeElement(this.root);
  //}
  //
  //componentWillUnmount() {
  //  window.componentHandler.downgradeElements(this.root);
  //}

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _toggleInlineStyle(inlineStyle) {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const {editorState} = this.state;
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    return (

    <div className={`${s["RichEditor-root"]}`}>
        <div className={className} onClick={this.focus}>
          <Editor
            placeholder="Place you content ..."
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            spellCheck={true}
          />
        </div>
    </div>
    );
  }
}


export default Amelietor;

