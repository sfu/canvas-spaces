import React from 'react';
import PropTypes from 'prop-types';
import ICInputField from '../components/ICInputField';

const SpaceDescriptionField = props => {
  const validate = event => {
    const space_description = event.target.value.trim();
    props.setError('description', '');

    // no empty descriptions
    if (space_description === '') {
      props.setError(
        'description',
        'You must enter a description for your Space'
      );
      return;
    }
  };

  return (
    <ICInputField
      name="description"
      label="Description"
      placeholder="A longer description of the purpose of your group"
      onChange={props.onChange}
      value={props.value}
      error={props.error}
      onBlur={validate}
    />
  );
};

SpaceDescriptionField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  setError: PropTypes.func,
};

SpaceDescriptionField.defaultProps = {
  value: '',
  error: '',
  onChange: () => {},
  validate: () => {},
};

export default SpaceDescriptionField;
