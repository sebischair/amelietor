import React from 'react';
import Link from '../Link';

class Navigation extends React.Component {
  render() {
    return (
      <div className="amelie-navigation-container">
        <nav className="amelie-navigation mdl-navigation" ref={node => (this.root = node)}>
          <Link className="mdl-navigation__link" to="/projects">Projects</Link>
          <Link className="mdl-navigation__link" to="/editor">Editor</Link>
        </nav>
      </div>
    );
  }
}

export default Navigation;
