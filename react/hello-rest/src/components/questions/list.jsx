"use strict";

import React  from 'react';
import Row    from './row';

class List extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <ul className="media-list">
          {
            this.props.listado.map((question) => {
              return <Row key = { question.id }
                          question = { question.question }
                          published_at = { question.published_at } />
            })
          }
        </ul>
      </div>
    );
  }
}

export default List;
