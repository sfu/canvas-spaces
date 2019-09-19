'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SpaceTile_Information from './SpaceTile_Information';
import SpaceTile_Avatar from './SpaceTile_Avatar';
import SpaceSettingsModal from '../SpaceSettingsModal';

class SpaceTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal(e) {
    e.preventDefault();
    this.setState({
      modalIsOpen: true,
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
    });
  }

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
          updateSpace={this.props.updateSpace}
          deleteSpace={this.props.deleteSpace}
        />
      </div>
    );
  }
}

SpaceTile.propTypes = {
  space: PropTypes.object.isRequired,
  avatar: PropTypes.string,
  context: PropTypes.string.isRequired,
  updateSpace: PropTypes.func.isRequired,
  deleteSpace: PropTypes.func.isRequired,
};

export default SpaceTile;
