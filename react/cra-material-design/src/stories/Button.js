import React from 'react';

const ButtonBar = ({}) => {
  return (
    <div className="container">
      <button type="button" className="btn btn-primary">Primary</button>
      <button type="button" className="btn btn-default">Default</button>
      <button type="button" className="btn btn-yt"><i className="fa fa-youtube left"></i> Youtube</button>
    </div>
  );
};

export default ButtonBar;
