'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ICInputField from '../components/ICInputField';

const SpaceNameField = props => {
  const validate = event => {
    props.setError('name', '');

    const space_name = event.target.value.trim();
    // no empty names
    if (space_name === '') {
      props.setError('name', 'You must enter a name for your Space');
      return;
    }

    props.validate(space_name, err => {
      if (err) {
        props.setError('name', err);
      }
    });
  };

  return (
    <ICInputField
      name="name"
      label="Space Name"
      placeholder="A short, descriptive name for your group (e.g. Basket Weaving Club)"
      autoFocus={props.autoFocus}
      onChange={props.onChange}
      value={props.value}
      error={props.error}
      onBlur={validate}
    />
  );
};

SpaceNameField.propTypes = {
  onChange: PropTypes.func,
  validate: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
  setError: PropTypes.func,
  autoFocus: PropTypes.bool,
};

SpaceNameField.defaultProps = {
  value: '',
  error: '',
  onChange: () => {},
  validate: () => {},
  autoFocus: true,
};

export default SpaceNameField;
