import React from 'react';

const Comment = (props) => (
  <div>
    <h4><a href={props.key}>{props.author}</a></h4>
    <p>{props.text}</p>
  </div>
);

Comment.propTypes = {
  id: React.PropTypes.number.isRequired,
  author: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired
};

Comment.defaultProps = {
  id: 1,
  author: 'Jane User',
  text: "I enjoy comments."
};

export default Comment;
