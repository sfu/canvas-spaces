import React from 'react'
import createReactClass from 'create-react-class'
import PropTypes from 'prop-types'
import ICRadioButtonGroup from '../components/ICRadioButtonGroup'

const radioButtons = [
  {
    label: 'Anyone can join this Space. This space will be listed in the public Space Directory.',
    value: 'free_to_join'
  },
  {
    label: 'People must be invited to join this Space',
    value: 'invite_only'
  }
]

const SpaceJoinLevelField = createReactClass({
  propTypes: {
    value: PropTypes.string,
    onChange: PropTypes.func,
    valueLink: PropTypes.shape({
      value: PropTypes.string.isRequired,
      requestChange: PropTypes.func.isRequired
    }).isRequired
  },

  getDefaultProps() {
    return {
      value: '',
      error: '',
      onChange: () => { },
      valueLink: null,
      errorLink: null
    }
  },

  getValueLink(props) {
    return (
      props.valueLink || {
        value: props.value,
        requestChange: props.onChange
      }
    )
  },

  handleChange(event) {
    const space_join_level = event.target.value
    this.getValueLink(this.props).requestChange(space_join_level)
  },

  render() {
    return (
      <ICRadioButtonGroup
        ref="join_level_radio_group"
        name="join_level"
        onChange={this.handleChange}
        checked={this.props.checked}
        buttonItems={radioButtons}
      />
    )
  }
})

export default SpaceJoinLevelField
