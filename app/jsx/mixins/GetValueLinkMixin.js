'use strict'

const GetValueLinkMixin = {
  getValueLink(props) {
    return props.valueLink || {
      value: props.value,
      requestChange: props.onChange
    }
  }
}

export default GetValueLinkMixin
