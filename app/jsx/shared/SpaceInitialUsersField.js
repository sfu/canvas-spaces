import React from 'react/addons'
import TagsInput from 'react-tagsinput'
import api from '../utils/api'
import HandleErrorsMixin from '../mixins/HandleErrorsMixin'
import GetValueLinkMixin from '../mixins/GetValueLinkMixin'
import ReactTagsInputHelpersMixin from '../mixins/ReactTagsInputHelpersMixin'

const { PropTypes } = React

const SpaceInitialUsersField = React.createClass({
  mixins: [
    React.addons.LinkedStateMixin,
    HandleErrorsMixin,
    GetValueLinkMixin,
    ReactTagsInputHelpersMixin
  ],

  propTypes: {
    valueLink: PropTypes.shape({
      value: PropTypes.array.isRequired,
      requestChange: PropTypes.func.isRequired
    }).isRequired,
    errorLink: PropTypes.shape({
      value: PropTypes.string.isRequired,
      requestChange: PropTypes.func.isRequired
    }).isRequired
  },

  getInitialState() {
    return {
      tags: []
    }
  },

  validate(tag, done) {
    const unique = this.state.tags.indexOf(tag) === -1

    if (!unique) {
      this.setError(`"${tag}" already exists`)
      return done(false)
    }

    if (tag !== '') {
      api.validate_field('user', tag, result => {
        const valid_user = result.valid_user
        if (!valid_user) {
          this.setError(`"${tag}" is not a valid Canvas user`)
        }
        done(valid_user)
      })
    }
  },

  render() {
    return (
      <div onClick={this.focusInput} className="ic-Form-control">
        <label htmlFor="space_initial_users" className="ic-Label">
          Initial Users
        </label>
        <div className="SFU-tagsinput-wrapper">
          <TagsInput
            name="space_initial_users"
            ref="space_initial_users"
            valueLink={this.linkState('tags')}
            placeholder="e.g. kipling@sfu.ca"
            classNamespace="SFU"
            addKeys={[13, 32, 188]} // return, space, comma
            removeKeys={[]}
            transform={this.transform}
            validateAsync={this.validate}
            onTagAdd={this.onTagAdd}
            onTagRemove={this.onTagRemove}
            onBeforeTag={this.onBeforeTag}
            onChangeInput={this.onChangeInput}
          />
        </div>
        {this.renderError()}
      </div>
    )
  }
})

export default SpaceInitialUsersField
