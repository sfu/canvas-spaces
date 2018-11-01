'use strict'

import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import ICInputField from '../components/ICInputField'
import HandleErrorsMixin from '../mixins/HandleErrorsMixin'
import GetValueLinkMixin from '../mixins/GetValueLinkMixin'

const SpaceNameField = createReactClass({
  mixins: [HandleErrorsMixin, GetValueLinkMixin],

  propTypes: {
    onChange: PropTypes.func,
    validate: PropTypes.func,
    valueLink: PropTypes.shape({
      value: PropTypes.string.isRequired,
      requestChange: PropTypes.func.isRequired
    }).isRequired,
    errorLink: PropTypes.shape({
      value: PropTypes.string.isRequired,
      requestChange: PropTypes.func.isRequired
    }).isRequired
  },

  getDefaultProps() {
    return {
      value: '',
      error: '',
      onChange: () => { },
      valueLink: null,
      errorLink: null,
      validate: () => { },
      autoFocus: true
    }
  },

  handleChange(event) {
    const space_name = event.target.value
    this.clearError()
    this.getValueLink(this.props).requestChange(space_name)
  },

  validate(event) {
    const space_name = event.target.value.trim()

    // no empty names
    if (space_name === '') {
      this.setError('You must enter a name for your Space')
      return
    }

    this.props.validate(space_name, err => {
      if (err) {
        this.setError(err)
      }
    })
  },

  render() {
    return (
      <ICInputField
        ref="space_name"
        name="space_name"
        label="Space Name"
        placeholder="A short, descriptive name for your group (e.g. Basket Weaving Club)"
        autoFocus={this.props.autoFocus}
        onChange={this.handleChange}
        value={this.getValueLink(this.props).value}
        error={this.getErrorLink(this.props).value}
        onBlur={this.validate}
      />
    )
  }
})

export default SpaceNameField
