import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import ICInputField from '../components/ICInputField';
import HandleErrorsMixin from '../mixins/HandleErrorsMixin';
import GetValueLinkMixin from '../mixins/GetValueLinkMixin';

const SpaceDescriptionField = createReactClass({
  mixins: [HandleErrorsMixin, GetValueLinkMixin],

  propTypes: {
    value: PropTypes.string,
    onChange: PropTypes.func,
    valueLink: PropTypes.shape({
      value: PropTypes.string.isRequired,
      requestChange: PropTypes.func.isRequired,
    }).isRequired,
    errorLink: PropTypes.shape({
      value: PropTypes.string.isRequired,
      requestChange: PropTypes.func.isRequired,
    }).isRequired,
  },

  getDefaultProps() {
    return {
      value: '',
      error: '',
      onChange: () => {},
      valueLink: null,
      errorLink: null,
    };
  },

  handleChange(event) {
    const space_description = event.target.value;
    this.clearError();
    this.getValueLink(this.props).requestChange(space_description);
  },

  validate(event) {
    const space_description = event.target.value.trim();

    // no empty descriptions
    if (space_description === '') {
      this.setError('You must enter a description for your Space');
      return;
    }
  },

  render() {
    return (
      <ICInputField
        ref="space_description"
        name="space_description"
        label="Description"
        placeholder="A longer description of the purpose of your group"
        onChange={this.handleChange}
        value={this.getValueLink(this.props).value}
        error={this.getErrorLink(this.props).value}
        onBlur={this.validate}
      />
    );
  },
});

export default SpaceDescriptionField;
