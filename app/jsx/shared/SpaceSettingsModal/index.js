import React, { Component } from 'react';

import PropTypes from 'prop-types';
import Modal from 'react-modal';
import api from '../../utils/api';
import SpaceNameField from '../../shared/SpaceNameField';
import SpaceDescriptionField from '../../shared/SpaceDescriptionField';
import SpaceMaillistField from '../../shared/SpaceMaillistField';
import SpaceLeaderField from '../../shared/SpaceLeaderField';

const initialErrorState = {
  name: '',
  description: '',
  join_type: '',
  members: '',
  maillist: '',
  leader_id: '',
};

Modal.setAppElement('#CanvasSpacesApp');

class SpaceSettingsModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      submitButtonState: 'submit',
      maillistFieldDirty: false,
      showSpinner: false,
      space: Object.assign({}, this.props.space),
      errors: Object.assign({}, initialErrorState),
      delete_button: {
        show_field: false,
        deletable: false,
        disabled: false,
      },
    };

    this.disableSubmit = this.disableSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteSpace = this.deleteSpace.bind(this);
    this.validateSpaceName = this.validateSpaceName.bind(this);
    this.validateMaillist = this.validateMaillist.bind(this);
    this.validateDeleteSpace = this.validateDeleteSpace.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setError = this.setError.bind(this);
  }

  disableSubmit() {
    const emptyFields =
      this.state.space.name === '' || this.state.space.description === '';
    const hasErrors =
      JSON.stringify(initialErrorState) !== JSON.stringify(this.state.errors);
    return (
      emptyFields ||
      hasErrors ||
      this.state.maillistFieldDirty ||
      this.state.submitButtonState === 'saving'
    );
  }

  handleChange(event) {
    const { name, value } = event.target;
    if (!name || !this.state.space.hasOwnProperty(name)) {
      return;
    }
    this.setState({
      space: {
        ...this.state.space,
        [name]: value,
      },
    });
  }

  setError(field, error) {
    const { errors } = this.state;
    this.setState({
      errors: {
        ...errors,
        [field]: error,
      },
    });
  }

  handleSubmit() {
    this.setState({
      submitButtonState: 'saving',
    });
    // do the validations and whatnot, and if everything is all good, pass it up the chain
    // ...validate...
    this.props.updateSpace(this.state.space, () => {
      this.setState({
        submitButtonState: 'submit',
      });
      this.props.onRequestClose();
    });
  }

  deleteSpace() {
    if (!this.state.delete_button.show_field) {
      this.setState({
        delete_button: {
          show_field: true,
          deletable: false,
          disabled: true,
        },
      });
      return;
    }

    if (this.state.delete_button.deletable) {
      this.props.deleteSpace(this.state.space, () => {});
    }
  }

  validateSpaceName(space_name, cb) {
    // // validate name against api
    if (this.props.space.name.toLowerCase() === space_name.toLowerCase()) {
      return;
    }
    api.validate_field('name', space_name, result => {
      if (!result.valid_group_name) {
        cb(result.message);
      }
    });
  }

  validateMaillist(maillist, cb) {
    this.setState({ maillistFieldDirty: true });
    api.validate_field('maillist', maillist, result => {
      if (!result.valid_maillist) {
        cb(result.reason);
      } else {
        this.setState({ maillistFieldDirty: false });
      }
    });
  }

  validateDeleteSpace(ev) {
    let delete_state;
    if (ev.target.value === this.state.space.name) {
      delete_state = {
        delete_button: {
          show_field: true,
          deletable: true,
          disabled: false,
        },
      };
    } else {
      delete_state = {
        delete_button: {
          show_field: true,
          deletable: false,
          disabled: true,
        },
      };
    }
    this.setState(delete_state);
  }

  render() {
    const delete_space_field = () => {
      return this.state.delete_button.show_field ? (
        <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            className="ic-Input"
            style={{ marginBottom: '1em' }}
            placeholder="Type the name of your space to confirm deletion"
            onChange={this.validateDeleteSpace}
          />
        </div>
      ) : (
        ''
      );
    };

    const submitButtonContent =
      this.state.submitButtonState === 'submit' ? (
        'Save Changes'
      ) : (
        <div>
          <div
            style={{ display: 'inline' }}
            className="LoadMoreDingus--LoadingIndicator"
          >
            <div className="LoadMoreDingus--LoadingIndicator-bounce" />
            <div className="LoadMoreDingus--LoadingIndicator-bounce" />
            <div className="LoadMoreDingus--LoadingIndicator-bounce" />
          </div>
          <span style={{ marginLeft: '1em' }}>Saving Changes</span>
        </div>
      );

    return (
      <Modal
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.props.onRequestClose}
        className={this.props.className}
        overlayClassName={this.props.overlayClassName}
        contentLabel={this.props.contentLabel}
      >
        <div className="ReactModal__Layout">
          <div className="ReactModal__InnerSection ReactModal__Header">
            <div className="ReactModal__Header-Title">
              <h4>Edit Space Settings</h4>
            </div>
            <div className="ReactModal__Header-Actions">
              <button
                className="Button Button--icon-action"
                type="button"
                onClick={this.props.onRequestClose}
              >
                <i className="icon-x" />
                <span className="screenreader-only">Close</span>
              </button>
            </div>
          </div>

          <div className="ReactModal__InnerSection ReactModal__Body">
            <div className="ic-Form-group ic-Form-group--horizontal">
              <fieldset>
                <legend>Name and Description</legend>
                <SpaceNameField
                  onChange={this.handleChange}
                  value={this.state.space.name}
                  validate={this.validateSpaceName}
                  setError={this.setError}
                  error={this.state.errors.name}
                />

                <SpaceDescriptionField
                  onChange={this.handleChange}
                  value={this.state.space.description}
                  setError={this.setError}
                  error={this.state.errors.description}
                />
              </fieldset>

              <fieldset>
                <legend>Space Membership</legend>

                <SpaceMaillistField
                  onChange={this.handleChange}
                  value={this.state.space.maillist}
                  setError={this.setError}
                  validate={this.validateMaillist}
                  error={this.state.errors.maillist}
                />
              </fieldset>

              <fieldset>
                <legend>Space Leader</legend>
                <p>
                  The Space Leader is the administrator of a Space. Only the
                  Space Leader can modify a Space's settings. There can be only
                  one Space Leader at a time.
                </p>
                <p>
                  <strong>
                    If you reassign leadership of this Space to another member,
                    you will no longer be able to modify this Space's settings.
                  </strong>
                </p>
                <SpaceLeaderField
                  onChange={this.handleChange}
                  setError={this.setError}
                  current={this.state.space.leader_id}
                  users={this.state.space.users}
                  error={this.state.errors.leader_id}
                />
              </fieldset>
            </div>

            <hr />
            {delete_space_field()}
            <button
              style={{ width: '100%' }}
              className="Button Button--danger"
              disabled={this.state.delete_button.disabled}
              onClick={this.deleteSpace}
            >
              Delete Space
            </button>
          </div>

          <div className="ReactModal__InnerSection ReactModal__Footer">
            <div className="ReactModal__Footer-Actions">
              <button
                type="button"
                className="btn btn-default"
                onClick={this.props.onRequestClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.handleSubmit}
                disabled={this.disableSubmit()}
              >
                {submitButtonContent}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

SpaceSettingsModal.propTypes = {
  modalIsOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  space: PropTypes.object,
  contentLabel: PropTypes.string,
  updateSpace: PropTypes.func.isRequired,
  deleteSpace: PropTypes.func.isRequired,
};

export default SpaceSettingsModal;
