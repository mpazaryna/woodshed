"use strict";

import React from 'react';

class Row extends React.Component {
  render() {
    return (
      <li className="media">
        <div className="media-body">
          <h1>{this.props.question}</h1>
          <span className="label label-info">{this.props.published_at}</span>
        </div>
        <hr/>
      </li>
    );
  }
}

export default Row;
