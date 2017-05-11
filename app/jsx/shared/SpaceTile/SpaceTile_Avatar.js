'use strict';

import React from 'react';
const {PropTypes} = React;

const SpaceTile_Avatar = React.createClass({
  propTypes: {
    avatar: PropTypes.string.isRequired
  },

  render() {
    return (
      <div className="SpaceTile--SpaceAvatar">
        <img src={this.props.avatar} />
      </div>

    );
  }

});

export default SpaceTile_Avatar;
