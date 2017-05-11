'use strict'

const HandleErrorsMixin = {
  setError(error) {
    this.getErrorLink(this.props).requestChange(error)
  },

  clearError() {
    this.getErrorLink(this.props).requestChange('')
  },

  hasErrors() {
    return this.props.errorLink.value.length > 0
  },

  getErrorLink(props) {
    return props.errorLink || {
      value: props.value,
      requestChange: this.setError
    }
  }
}

export default HandleErrorsMixin
