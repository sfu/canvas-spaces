import React, { PropTypes } from 'react'
import createReactClass from 'create-react-class'

const controlClass = 'ic-Form-control'
const labelClass = 'ic-Label'
const inputClass = 'ic-Input'

const ICSelect = createReactClass({
  propTypes: {
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.number,
    placeholder: PropTypes.string,
    labelClasses: PropTypes.string,
    inputClasses: PropTypes.string,
    error: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    autoFocus: PropTypes.string,
    defaultValue: PropTypes.string
  },

  getDefaultProps() {
    return {
      onBlur: () => {},
      autoFocus: false,
      options: []
    }
  },
  getValue() {
    return this.getDOMNode().querySelector('input[type="text"]').value
  },

  options() {
    return this.props.options.map((o, i) => {
      return <option key={i} value={o.value}>{o.name}</option>
    })
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
        <select
          id={this.props.name}
          className={inputClasses()}
          value={this.props.value}
          onChange={this.props.onChange}
          onBlur={this.props.onBlur}
          autoFocus={this.props.autoFocus}
          defaultValue={this.props.defaultValue}
        >
          {this.options()}
        </select>
        {this.error()}
      </div>
    )
  }
})

export default ICSelect
