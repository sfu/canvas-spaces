import React from 'react';
import PropTypes from 'prop-types';
import ICRadioButton from './ICRadioButton';

const ICRadioButtonGroup = props => {
  const renderRadioButtons = () => {
    return props.buttonItems.map((buttonItem, index) => {
      const id = `${props.name}-${index}`;

      const checked = props.checked === buttonItem.value ? true : false;
      return (
        <ICRadioButton
          label={buttonItem.label}
          value={buttonItem.value}
          id={id}
          name={props.name}
          key={id}
          checked={checked}
          onChange={props.onChange}
        />
      );
    });
  };

  return (
    <div className="ic-Form-control ic-Form-control--radio">
      {renderRadioButtons()}
    </div>
  );
};

ICRadioButtonGroup.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.string,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  buttonItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  checkedAndDefaultChecked: (props, propName, componentName) => {
    if (props.checked && props.defaultChecked) {
      return new Error(
        `both 'checked' and 'defaultChecked' are present on ${componentName}.`
      );
    }
  },
};

export default ICRadioButtonGroup;
