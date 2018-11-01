import React from 'react'
import PropTypes from 'prop-types'
import createReactClass from 'create-react-class'

const LoadMoreDingus = createReactClass({
  propTypes: {
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired
  },

  getDefaultProps() {
    return {
      title: 'Load More',
      onClick: () => { },
      loading: false
    }
  },

  render() {
    const loading_icon = (
      <div className="LoadMoreDingus--LoadingIndicator">
        <div className="LoadMoreDingus--LoadingIndicator-bounce" />
        <div className="LoadMoreDingus--LoadingIndicator-bounce" />
        <div className="LoadMoreDingus--LoadingIndicator-bounce" />
      </div>
    )

    const static_icon = <i className="icon-more" />

    const icon = this.props.loading ? loading_icon : static_icon

    return (
      <button
        title={this.props.title}
        onClick={this.props.onClick}
        className="Button Button--primary LoadMoreDingus"
        disabled={this.props.disabled}
      >
        {icon}
      </button>
    )
  }
})

export default LoadMoreDingus
