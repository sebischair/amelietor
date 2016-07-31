import React, { PropTypes } from 'react'

const Token = ({children, onClick }) => {

  return (
    <span style={{ backgroundColor: '#5bc0de'}} onClick={e => {
         e.preventDefault()
         onClick()
       }}>
      {children}
    </span>
  )
}

Token.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Token
