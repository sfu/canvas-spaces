'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

const SpaceTile_Avatar = createReactClass({
  propTypes: {
    avatar: PropTypes.string.isRequired,
  },

  render() {
    return (
      <div className="SpaceTile--SpaceAvatar">
        <img src={this.props.avatar} />
      </div>
    );
  },
});

export default SpaceTile_Avatar;
