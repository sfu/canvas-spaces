'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import TagsInput from 'react-tagsinput';
import api from '../utils/api';
import HandleErrorsMixin from '../mixins/HandleErrorsMixin';
import GetValueLinkMixin from '../mixins/GetValueLinkMixin';
import ReactTagsInputHelpersMixin from '../mixins/ReactTagsInputHelpersMixin';

const SpaceMaillistField = createReactClass({
  mixins: [
    React.addons.LinkedStateMixin,
    HandleErrorsMixin,
    GetValueLinkMixin,
    ReactTagsInputHelpersMixin,
  ],

  propTypes: {
    valueLink: PropTypes.shape({
      value: PropTypes.array.isRequired,
      requestChange: PropTypes.func.isRequired,
    }).isRequired,
    errorLink: PropTypes.shape({
      value: PropTypes.string.isRequired,
      requestChange: PropTypes.func.isRequired,
    }).isRequired,
  },

  getInitialState() {
    return {
      tags: [],
    };
  },

  validate(tag, done) {
    const unique = this.state.tags.indexOf(tag) === -1;

    if (!unique) {
      this.setError(`"${tag}" already exists`);
      return done(false);
    }

    if (tag !== '') {
      api.validate_field('maillist', tag, result => {
        const valid = result.valid_maillist;
        if (!valid) {
          this.setError(`"${tag}" is not a valid maillist`);
        }
        done(valid);
      });
    }
  },

  render() {
    return (
      <div onClick={this.focusInput} className={this.controlClasses()}>
        <label htmlFor="space_maillists" className="ic-Label">
          Maillists
        </label>
        <div className="SFU-tagsinput-wrapper">
          <TagsInput
            name="space_maillists"
            ref="space_maillists"
            valueLink={this.linkState('tags')}
            placeholder="e.g. my-list@sfu.ca"
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
    );
  },
});

export default SpaceMaillistField;
