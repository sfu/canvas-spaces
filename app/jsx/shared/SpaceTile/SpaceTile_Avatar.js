'use strict';

import React from 'react';
import PropTypes from 'prop-types';

const SpaceTile_Avatar = ({ avatar }) => (
  <div className="SpaceTile--SpaceAvatar">
    <img alt="" src={avatar} />
  </div>
);

SpaceTile_Avatar.propTypes = {
  avatar: PropTypes.string.isRequired,
};

export default SpaceTile_Avatar;
