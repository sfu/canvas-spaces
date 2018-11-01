import React from 'react'
import PropTypes from 'prop-types'

const ErrorBox = ({ error }) => {
  if (!error) {
    return <div />
  }
  return (
    <div className="alert alert-error">
      <strong>Error:</strong><span> {error}</span>
    </div>
  )
}

ErrorBox.propTypes = {
  error: PropTypes.string
}

export default ErrorBox
