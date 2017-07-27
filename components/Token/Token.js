import React, { PropTypes } from 'react'
import s from "./Token.css"

const Token = (props) => {

  return (
    <span className={`${s.annotation}`} onClick={e => {
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
  data: PropTypes.object.isRequired
};

export default Token
