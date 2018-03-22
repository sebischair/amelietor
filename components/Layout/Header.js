import React from 'react';
import Navigation from './Navigation';
import Link from '../Link';

class Header extends React.Component {
  render() {
    return (
        <div className="amelie-header mdl-layout__header mdl-layout__header--waterfall">
          <div className="mdl-layout__header-row">
            <span className="amelie-title mdl-layout-title">
              <Link className="mdl-navigation__link" to="/">AMELIE - Decision Explorer</Link>
            </span>
            <div className="amelie-header-spacer mdl-layout-spacer"></div>
            <Navigation />
          </div>
        </div>
    );
  }
}

export default Header;
