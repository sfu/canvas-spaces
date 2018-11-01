import React from 'react'
import createReactClass from 'create-react-class'
import DeepLinkedStateMixin from '../../mixins/DeepLinkedStateMixin'

import api from '../../utils/api'
import SpaceNameField from '../../shared/SpaceNameField'
import SpaceDescriptionField from '../../shared/SpaceDescriptionField'
import SpaceJoinLevelField from '../../shared/SpaceJoinLevelField'
import SpaceMaillistField from '../../shared/SpaceMaillistField'

const initialErrorState = {
  name: '',
  description: '',
  join_type: '',
  maillist: ''
}

const CreateSpace = createReactClass({
  linkState: DeepLinkedStateMixin,

  getInitialState() {
    return {
      submitButtonState: 'submit',
      maillistFieldDirty: false,
      space: {
        name: '',
        description: '',
        join_type: 'invite_only',
        maillist: ''
      },
      errors: Object.assign({}, initialErrorState)
    }
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

  flashError(error_message) {
    $.flashError(error_message)
  },

  handleSubmit() {
    const error_message =
      'There was a problem creating your space. Please check the form for errors and try again.'
    if (this.disableSubmit()) {
      this.flashError(error_message)
      return
    }

    this.setState({ submitButtonState: 'saving' })

    api.create_space(this.state.space, response => {
      this.setState({ submitButtonState: 'saving' })
      if (response.status !== 200) {
        if (response.body.hasOwnProperty('field')) {
          this.linkState(`errors.${response.body.field}`).requestChange(
            response.body.error
          )
        }
        this.flashError(error_message)
      } else {
        // redirect to the new space
        var space_url = `/groups/${response.body.id}`
        // TODO: show a modal with a choice: go to new space, or create a new one?
        window.location = space_url
      }
    })
  },

  validateSpaceName(space_name, cb) {
    // // validate name against api
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

    const maillist_help_text = () => {
      if (this.state.space.join_type === 'invite_only') {
        return (
          <p>
            The membership of your Space will be updated when the membership
            of the maillist changes. Only SFU members of the maillist will be synchronized
            with the Space.
          </p>
        )
      } else {
        return (
          <p>
            There will be a one-time sync of the SFU members of the maillist with the Space.
          </p>
        )
      }
    }

    const submitButtonContent = this.state.submitButtonState === 'submit'
      ? 'Create Space'
      : (<div>
          <div
            style={{ display: 'inline' }}
            className="LoadMoreDingus--LoadingIndicator"
          >
            <div className="LoadMoreDingus--LoadingIndicator-bounce" />
            <div className="LoadMoreDingus--LoadingIndicator-bounce" />
            <div className="LoadMoreDingus--LoadingIndicator-bounce" />
          </div>
          <span style={{ marginLeft: '1em' }}>Creating Space</span>
        </div>)

    return (
      <div>
        <h2>Create New Space</h2>
        <div className="ic-Form-group ic-Form-group--horizontal">

          <fieldset>
            <legend>Name and Description</legend>
            <SpaceNameField
              valueLink={this.linkState('space.name')}
              errorLink={this.linkState('errors.name')}
              validate={this.validateSpaceName}
            />

            <SpaceDescriptionField
              valueLink={this.linkState('space.description')}
              errorLink={this.linkState('errors.description')}
            />
          </fieldset>

          {join_type_field()}

          <fieldset>
            <p>
              You can use a
              {' '}
              <a
                href="http://maillist.sfu.ca"
                target="_blank"
                rel="noopener noreferrer"
              >
                SFU Maillist
              </a>
              {' '}
              to control who can access your Space.
              If you don't have a list set up already, you can add one later.
              {' '}
              <br />
              If you don't add a maillist, you will be the only member of your Space.
            </p>

            <legend>Space Membership</legend>

            <SpaceMaillistField
              valueLink={this.linkState('space.maillist')}
              errorLink={this.linkState('errors.maillist')}
              dirtyLink={this.linkState('maillistFieldDirty')}
              validate={this.validateMaillist}
            />
            {maillist_help_text()}
          </fieldset>

          <div className="ic-Form-actions">
            <button
              className="Button Button--primary"
              disabled={this.disableSubmit()}
              type="submit"
              onClick={this.handleSubmit}
            >
              {submitButtonContent}
            </button>
          </div>
        </div>
      </div>
    )
  }
})

export default CreateSpace
