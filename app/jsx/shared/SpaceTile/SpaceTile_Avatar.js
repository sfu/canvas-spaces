'use strict';

import React from 'react';
const {PropTypes} = React;
import createReactClass from 'create-react-class'

const SpaceTile_Avatar = createReactClass({
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
