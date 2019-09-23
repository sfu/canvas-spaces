'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import ICInputField from '../components/ICInputField';

const SpaceMaillistField = props => {
  const validate = event => {
    props.setError('maillist', '');
    const maillist = event.target.value.trim().replace('@sfu.ca', '');

    if (!maillist || maillist === '') {
      return;
    }

    props.validate(maillist, err => {
      if (err) {
        props.setError('maillist', err);
      }
    });
  };

  return (
    <ICInputField
      name="maillist"
      label="Maillist"
      placeholder="A SFU Maillist containing the members of your Space"
      onChange={props.onChange}
      value={props.value}
      error={props.error}
      onBlur={validate}
    />
  );
};

SpaceMaillistField.propTypes = {
  onChange: PropTypes.func,
  validate: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
  setError: PropTypes.func,
};

SpaceMaillistField.defaultProps = {
  value: '',
  error: '',
  onChange: () => {},
  valueLink: null,
  errorLink: null,
  validate: () => {},
};

export default SpaceMaillistField;
