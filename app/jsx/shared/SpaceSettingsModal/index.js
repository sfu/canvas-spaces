import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import DeepLinkedStateMixin from '../../mixins/DeepLinkedStateMixin'
import api from '../../utils/api'
import SpaceNameField from '../../shared/SpaceNameField'
import SpaceDescriptionField from '../../shared/SpaceDescriptionField'
import SpaceJoinLevelField from '../../shared/SpaceJoinLevelField'
import SpaceMaillistField from '../../shared/SpaceMaillistField'
import SpaceLeaderField from '../../shared/SpaceLeaderField'
import SpaceActions from '../../pages/MySpaces/actions'

const initialErrorState = {
  name: '',
  description: '',
  join_type: '',
  members: '',
  maillist: '',
  leader_id: ''
}

Modal.setAppElement(document.getElementById('CanvasSpacesApp'))

const SpaceSettingsModal = createReactClass({
  linkState: DeepLinkedStateMixin,

  propTypes: {
    modalIsOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    className: PropTypes.string,
    overlayClassName: PropTypes.string
  },

  getInitialState() {
    return {
      submitButtonState: 'submit',
      maillistFieldDirty: false,
      showSpinner: false,
      space: Object.assign({}, this.props.space),
      errors: Object.assign({}, initialErrorState),
      delete_button: {
        show_field: false,
        deletable: false,
        disabled: false
      }
    }
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      space: Object.assign({}, nextProps.space),
      errors: Object.assign({}, initialErrorState),
      delete_button: {
        show_field: false,
        deletable: false,
        disabled: false
      }
    })
  },

  disableSubmit() {
    const emptyFields =
      this.state.space.name === '' || this.state.space.description === ''
    const hasErrors =
      JSON.stringify(initialErrorState) !== JSON.stringify(this.state.errors)
    return (
      emptyFields ||
      hasErrors ||
      this.state.maillistFieldDirty ||
      this.state.submitButtonState === 'saving'
    )
  },

  handleSubmit() {
    this.setState({
      submitButtonState: 'saving'
    })
    // do the validations and whatnot, and if everything is all good, pass it up the chain
    // ...validate...
    SpaceActions.updateSpace(this.state.space, () => {
      this.setState({
        submitButtonState: 'submit'
      })
      this.props.onRequestClose()
    })
  },

  deleteSpace() {
    if (!this.state.delete_button.show_field) {
      this.setState({
        delete_button: {
          show_field: true,
          deletable: false,
          disabled: true
        }
      })
      return
    }

    if (this.state.delete_button.deletable) {
      SpaceActions.deleteSpace(this.state.space, () => { })
    }
  },

  validateSpaceName(space_name, cb) {
    // // validate name against api
    if (this.state.space.name.toLowerCase() === space_name.toLowerCase()) {
      return
    }
    api.validate_field('name', space_name, result => {
      if (!result.valid_group_name) {
        cb(result.message)
      }
    })
  },

  validateMaillist(maillist, cb) {
    this.setState({ maillistFieldDirty: true })
    api.validate_field('maillist', maillist, result => {
      if (!result.valid_maillist) {
        cb(result.reason)
      } else {
        this.setState({ maillistFieldDirty: false })
      }
    })
  },

  validateDeleteSpace(ev) {
    let delete_state
    if (ev.target.value === this.state.space.name) {
      delete_state = {
        delete_button: {
          show_field: true,
          deletable: true,
          disabled: false
        }
      }
    } else {
      delete_state = {
        delete_button: {
          show_field: true,
          deletable: false,
          disabled: true
        }
      }
    }
    this.setState(delete_state)
  },

  render() {
    const serverConfig = window.ENV.CANVAS_SPACES_CONFIG || {}

    const join_type_field = () => {
      return serverConfig.public_spaces_enabled === 'yes'
        ? <fieldset>
          <legend>Privacy Options</legend>

          <SpaceJoinLevelField
            checked={this.state.space.join_type}
            valueLink={this.linkState('space.join_type')}
          />
        </fieldset>
        : ''
    }

    const delete_space_field = () => {
      return this.state.delete_button.show_field
        ? <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            className="ic-Input"
            style={{ marginBottom: '1em' }}
            placeholder="Type the name of your space to confirm deletion"
            onChange={this.validateDeleteSpace}
          />
        </div>
        : ''
    }

    const submitButtonContent = this.state.submitButtonState === 'submit'
      ? 'Save Changes'
      : (<div>
        <div
          style={{ display: 'inline' }}
          className="LoadMoreDingus--LoadingIndicator"
        >
          <div className="LoadMoreDingus--LoadingIndicator-bounce" />
          <div className="LoadMoreDingus--LoadingIndicator-bounce" />
          <div className="LoadMoreDingus--LoadingIndicator-bounce" />
        </div>
        <span style={{ marginLeft: '1em' }}>Saving Changes</span>
      </div>)

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
                  validate={this.validateSpaceName}
                  valueLink={this.linkState('space.name')}
                  errorLink={this.linkState('errors.name')}
                />

                <SpaceDescriptionField
                  valueLink={this.linkState('space.description')}
                  errorLink={this.linkState('errors.description')}
                />
              </fieldset>

              <fieldset>
                <legend>Space Membership</legend>

                <SpaceMaillistField
                  valueLink={this.linkState('space.maillist')}
                  errorLink={this.linkState('errors.maillist')}
                  dirtyLink={this.linkState('maillistFieldDirty')}
                  validate={this.validateMaillist}
                />
              </fieldset>

              <fieldset>
                <legend>Space Leader</legend>
                <p>
                  The Space Leader is the administrator of a Space. Only the Space Leader can modify a Space's settings. There can be only one Space Leader at a time.
                </p>
                <p>
                  <strong>
                    If you reassign leadership of this Space to another member, you will no longer be able to modify this Space's settings.
                  </strong>
                </p>
                <SpaceLeaderField
                  valueLink={this.linkState('space.leader_id')}
                  errorLink={this.linkState('errors.leader_id')}
                  current={this.state.space.leader_id}
                  users={this.state.space.users}
                />
              </fieldset>

              {join_type_field()}

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
    )
  }
})

export default SpaceSettingsModal
