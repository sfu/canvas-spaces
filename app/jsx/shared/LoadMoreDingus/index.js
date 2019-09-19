import React from 'react';
import PropTypes from 'prop-types';

const LoadMoreDingus = props => {
  const loading_icon = (
    <div className="LoadMoreDingus--LoadingIndicator">
      <div className="LoadMoreDingus--LoadingIndicator-bounce" />
      <div className="LoadMoreDingus--LoadingIndicator-bounce" />
      <div className="LoadMoreDingus--LoadingIndicator-bounce" />
    </div>
  );

  const static_icon = <i className="icon-more" />;

  const icon = props.loading ? loading_icon : static_icon;

  return (
    <button
      title={props.title}
      onClick={props.onClick}
      className="Button Button--primary LoadMoreDingus"
      disabled={props.disabled}
    >
      {icon}
    </button>
  );
};

LoadMoreDingus.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
};

LoadMoreDingus.defaultProps = {
  title: 'Load More',
  onClick: () => {},
  loading: false,
};

export default LoadMoreDingus;
