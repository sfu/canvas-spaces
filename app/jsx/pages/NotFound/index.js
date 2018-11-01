import React from 'react';

export default () => {
  const divstyle = {
    textAlign: 'center',
    paddingTop: '35px',
  };

  const imgstyle = {
    width: '25%',
  };

  return (
    <div style={divstyle}>
      <img
        style={imgstyle}
        src="/images/sadpanda.svg"
        alt="The panda is sad because it couldn't find the page you wanted"
      />
      <h2>Page Not Found</h2>
      <p>Oops, we couldn't find that page.</p>
    </div>
  );
};
