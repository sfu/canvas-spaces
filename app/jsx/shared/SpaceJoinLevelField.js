import React from 'react';
import PropTypes from 'prop-types';
import ICRadioButtonGroup from '../components/ICRadioButtonGroup';

const radioButtons = [
  {
    label:
      'Anyone can join this Space. This space will be listed in the public Space Directory.',
    value: 'free_to_join',
  },
  {
    label: 'People must be invited to join this Space',
    value: 'invite_only',
  },
];

const SpaceJoinLevelField = props => {
  const getValueLink = props => {
    return (
      props.valueLink || {
        value: props.value,
        requestChange: props.onChange,
      }
    );
  };

  const handleChange = event => {
    const space_join_level = event.target.value;
    getValueLink(props).requestChange(space_join_level);
  };

  return (
    <ICRadioButtonGroup
      name="join_level"
      onChange={handleChange}
      checked={props.checked}
      buttonItems={radioButtons}
    />
  );
};

SpaceJoinLevelField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.string,
  valueLink: PropTypes.shape({
    value: PropTypes.string.isRequired,
    requestChange: PropTypes.func.isRequired,
  }).isRequired,
};

SpaceJoinLevelField.defaultProps = {
  value: '',
  error: '',
  onChange: () => {},
  valueLink: null,
  errorLink: null,
};

export default SpaceJoinLevelField;
