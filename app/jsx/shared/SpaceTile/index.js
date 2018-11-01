'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import SpaceTile_Information from './SpaceTile_Information';
import SpaceTile_Avatar from './SpaceTile_Avatar';
import SpaceSettingsModal from '../SpaceSettingsModal';

const SpaceTile = createReactClass({
  propTypes: {
    space: PropTypes.object.isRequired,
    avatar: PropTypes.string,
    context: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      modalIsOpen: false,
    };
  },

  openModal(e) {
    e.preventDefault();
    this.setState({
      modalIsOpen: true,
    });
  },

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  },

  render() {
    const serverConfig = window.ENV.CANVAS_SPACES_CONFIG || {};
    const space_url = `/groups/${this.props.space.id}`;
    const space = this.props.space;
    return (
      <div>
        <div className="SpaceTile">
          <SpaceTile_Information
            name={space.name}
            description={space.description}
            is_leader={space.is_leader}
            editButtonHandler={this.openModal}
            space_url={space_url}
          />
          <SpaceTile_Avatar avatar={this.props.avatar} />
        </div>
        <SpaceSettingsModal
          space={this.props.space}
          className="ReactModal__Content--canvas"
          overlayClassName="ReactModal__Overlay--canvas"
          modalIsOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          serverConfig={serverConfig}
          contentLabel={space.name}
        />
      </div>
    );
  },
});

export default SpaceTile;
