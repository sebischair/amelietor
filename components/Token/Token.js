import React, { PropTypes } from 'react'
import s from "./Token.css"

const Token = (props) => {
  console.log(props.data);
  return (
    <span style={{ backgroundColor: '#5bc0de'}} onClick={e => {
         e.preventDefault();
         props.onClick();
       }}>

      {props.children}
      <span className={`${s.pos}`}>
        {props.data.tag}
      </span>
    </span>
  )
};

Token.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Token
