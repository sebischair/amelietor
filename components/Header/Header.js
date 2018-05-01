import React, { PropTypes } from 'react';
import Navigation from '../Layout/Navigation';
import Link from '../Link';
import s from './Header.css';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={
          'amelie-header mdl-layout__header mdl-layout__header--waterfall ' +
          (this.props.displayNavigation ? 'show' : 'hidden')
        }
      >
        <div className={`${s.headerRow} mdl-layout__header-row`}>
          <span className="amelie-title mdl-layout-title">
            <Link className="mdl-navigation__link" to="/">
              AMELIE - Decision Explorer
            </Link>
          </span>
          <div className="amelie-header-spacer mdl-layout-spacer" />
          <Navigation />
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  displayNavigation: PropTypes.bool
};

export default Header;
