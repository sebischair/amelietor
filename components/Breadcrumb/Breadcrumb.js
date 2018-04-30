import React, { PropTypes } from 'react';
import s from './Breadcrumb.css';

class Breadcrumb extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className={s.breadcrumb}>
        {this.props.breadcrumbs.map((breadcrumb, index) => {
          return (
            <li key={index}>
              <a href={breadcrumb.url}>{breadcrumb.label}</a>
            </li>
          );
        })}
      </ul>
    );
  }
}

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.array.isRequired
};

export default Breadcrumb;
