import React from 'react';
import PropTypes from 'prop-types';
import ICSelect from '../components/ICSelect';

const SpaceLeaderField = props => {
  const options = props.users.map(user => {
    return { value: user.id, name: user.name };
  });
  return (
    <ICSelect
      name="leader_id"
      label="Leader"
      onChange={props.onChange}
      value={props.current}
      error={props.error}
      options={options}
    />
  );
};

SpaceLeaderField.propTypes = {
  onChange: PropTypes.func,
  setError: PropTypes.func,
  current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  users: PropTypes.array.isRequired,
};

SpaceLeaderField.defaultProps = {
  value: '',
  error: '',
  onChange: () => {},
  valueLink: null,
  errorLink: null,
};
export default SpaceLeaderField;
