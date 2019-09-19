import React from 'react';
import PropTypes from 'prop-types';

const ICRadioButton = props => (
  <div className="ic-Radio">
    <input
      id={props.id}
      type="radio"
      name={props.name}
      value={props.value}
      checked={props.checked}
      onChange={props.onChange}
    />
    <label htmlFor={props.id} className="ic-Label">
      {props.label}
    </label>
  </div>
);

ICRadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

export default ICRadioButton;
