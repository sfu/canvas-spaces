import React, { PropTypes } from 'react'
import createReactClass from 'create-react-class'

const ICRadioButton = createReactClass({
  propTypes: {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func
  },

  render() {
    return (
      <div className="ic-Radio">
        <input
          id={this.props.id}
          type="radio"
          name={this.props.name}
          value={this.props.value}
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <label htmlFor={this.props.id} className="ic-Label">
          {this.props.label}
        </label>
      </div>
    )
  }
})

export default ICRadioButton
