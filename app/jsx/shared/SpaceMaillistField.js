'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import ICInputField from '../components/ICInputField';
import HandleErrorsMixin from '../mixins/HandleErrorsMixin';
import GetValueLinkMixin from '../mixins/GetValueLinkMixin';

const SpaceMaillistField = createReactClass({
  mixins: [HandleErrorsMixin, GetValueLinkMixin],

  propTypes: {
    onChange: PropTypes.func,
    validate: PropTypes.func,
    valueLink: PropTypes.shape({
      value: PropTypes.string,
      requestChange: PropTypes.func.isRequired,
    }).isRequired,
    errorLink: PropTypes.shape({
      value: PropTypes.string,
      requestChange: PropTypes.func.isRequired,
    }).isRequired,
  },

  getDirtyLink(props) {
    return (
      props.dirtyLink || {
        value: props.value,
        requestChange: props.onChange,
      }
    );
  },

  getDefaultProps() {
    return {
      value: '',
      error: '',
      onChange: () => {},
      valueLink: null,
      errorLink: null,
      validate: () => {},
    };
  },

  handleChange(event) {
    const maillist = event.target.value;
    this.clearError();
    this.getDirtyLink(this.props).requestChange(maillist === '' ? false : true);
    this.getValueLink(this.props).requestChange(maillist);
  },

  validate(event) {
    const maillist = event.target.value.trim().replace('@sfu.ca', '');

    if (!maillist || maillist === '') {
      return;
    }

    this.props.validate(maillist, err => {
      if (err) {
        this.setError(err);
      }
    });
  },

  render() {
    return (
      <ICInputField
        ref="space_maillist"
        name="space_maillist"
        label="Maillist"
        placeholder="A SFU Maillist containing the members of your Space"
        onChange={this.handleChange}
        value={this.getValueLink(this.props).value}
        error={this.getErrorLink(this.props).value}
        onBlur={this.validate}
      />
    );
  },
});

export default SpaceMaillistField;
