import React from 'react';
import PropTypes from 'prop-types';

const controlClass = 'ic-Form-control';
const labelClass = 'ic-Label';
const inputClass = 'ic-Input';

const ICSelect = props => {
  const options = () => {
    return props.options.map((o, i) => {
      return (
        <option key={i} value={o.value}>
          {o.name}
        </option>
      );
    });
  };

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
      <select
        id={props.name}
        name={props.name}
        className={inputClasses()}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        autoFocus={props.autoFocus}
        defaultValue={props.defaultValue}
      >
        {options()}
      </select>
      {error()}
    </div>
  );
};

ICSelect.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  placeholder: PropTypes.string,
  labelClasses: PropTypes.string,
  inputClasses: PropTypes.string,
  error: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  autoFocus: PropTypes.bool,
  defaultValue: PropTypes.string,
};

ICSelect.defaultProps = {
  onBlur: () => {},
  autoFocus: false,
  options: [],
};

export default ICSelect;
