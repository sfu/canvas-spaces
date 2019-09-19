'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const SpaceTile_Information = ({
  name,
  description,
  is_leader,
  editButtonHandler,
  space_url,
}) => {
  const button = (icon, title, handler) => {
    return (
      <button
        className="SpaceTile--SpaceInformation-editButton Button Button--small"
        onClick={handler}
      >
        <i className={icon} />
        {title}
      </button>
    );
  };

  const edit_button = is_leader
    ? button('icon-settings', 'Change Space Settings', editButtonHandler)
    : '';

  const leader_text = is_leader ? (
    <p className="SpaceTile--SpaceInformation-leaderNote">
      You are the leader of this space.
    </p>
  ) : (
    ''
  );

  return (
    <div className="SpaceTile--SpaceInformation">
      <a style={{ color: '#000' }} href={space_url}>
        <h1 title={name}>{name}</h1>
      </a>
      <h2 title={description}>{description}</h2>
      {edit_button}
      {leader_text}
    </div>
  );
};

SpaceTile_Information.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  is_leader: PropTypes.bool.isRequired,
  space_url: PropTypes.string.isRequired,
  editButtonHandler: PropTypes.func,
};

export default SpaceTile_Information;
