import React from 'react';
import PropTypes from 'prop-types';
const controlClass = 'ic-Form-control';
const labelClass = 'ic-Label';
const inputClass = 'ic-Input';

const ICInputField = props => {
  const error = () => {
    if (props.error) {
      return (
        <div className="ic-Form-message ic-Form-message--error">
          <div className="ic-Form-message__Layout">
            <i className="icon-warning" role="presentation" />
            {props.error}
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  const labelClasses = props.labelClasses
    ? `${labelClass} ${props.labelClasses}`
    : labelClass;
  const controlClasses = props.error
    ? `${controlClass} ${controlClass}--has-error`
    : controlClass;

  const inputClasses = () => {
    const baseClass = props.error
      ? `${inputClass} ${inputClass}--has-error`
      : inputClass;
    return props.inputClasses
      ? `${baseClass} ${props.inputClasses}`
      : baseClass;
  };

  return (
    <div className={controlClasses}>
      <label htmlFor={props.name} className={labelClasses}>
        {props.label}
      </label>
      <input
        type="text"
        name={props.name}
        className={inputClasses()}
        placeholder={props.placeholder}
        value={props.value || ''}
        onChange={props.onChange}
        onBlur={props.onBlur}
        autoFocus={props.autoFocus}
      />
      {error()}
    </div>
  );
};

ICInputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  labelClasses: PropTypes.string,
  inputClasses: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  autoFocus: PropTypes.bool,
};

ICInputField.defaultProps = {
  onBlur: () => {},
  autoFocus: false,
};

export default ICInputField;
