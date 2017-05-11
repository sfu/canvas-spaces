import React, { PropTypes } from 'react'
import createReactClass from 'create-react-class'
const controlClass = 'ic-Form-control'
const labelClass = 'ic-Label'
const inputClass = 'ic-Input'

const ICInputField = createReactClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    labelClasses: PropTypes.string,
    inputClasses: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    autoFocus: PropTypes.bool
  },

  getDefaultProps() {
    return {
      onBlur: () => {},
      autoFocus: false
    }
  },
  getValue() {
    return this.getDOMNode().querySelector('input[type="text"]').value
  },

  error() {
    if (this.props.error) {
      return (
        <div className="ic-Form-message ic-Form-message--error">
          <div className="ic-Form-message__Layout">
            <i className="icon-warning" role="presentation" />
            {this.props.error}
          </div>
        </div>
      )
    } else {
      return null
    }
  },

  render() {
    const labelClasses = this.props.labelClasses
      ? `${labelClass} ${this.props.labelClasses}`
      : labelClass
    const controlClasses = this.props.error
      ? `${controlClass} ${controlClass}--has-error`
      : controlClass

    const inputClasses = () => {
      const baseClass = this.props.error
        ? `${inputClass} ${inputClass}--has-error`
        : inputClass
      return this.props.inputClasses
        ? `${baseClass} ${this.props.inputClasses}`
        : baseClass
    }

    return (
      <div className={controlClasses}>
        <label htmlFor={this.props.name} className={labelClasses}>
          {this.props.label}
        </label>
        <input
          type="text"
          id={this.props.name}
          className={inputClasses()}
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          autoFocus={this.props.autoFocus}
        />
        {this.error()}
      </div>
    )
  }
})

export default ICInputField
