// Stateless Functional Components
//
// Notice the code is just a function
// If your component has just a render method (and no state),
// you can simply create your component as a Stateless Functional Component
// and your function will be passed props as its first argument.
// Also notice that we’re NOT calling this a Stateless Component
// or a Functional Component.
//
// https://tylermcginnis.com/functional-components-vs-stateless-functional-components-vs-stateless-components-630fdfd90c9c#.1hqttt4d3

import React from 'react';
import Comment from '../components/comment/comment';
import CommentForm from '../components/comment/commentForm';

var comments = [
  {id: 1, author: "Pete", text: "This is one comment"},
  {id: 2, author: "Jill", text: "This is *two* comment"},
  {id: 3, author: "Ted", text: "This is *three* comment"},
  {id: 4, author: "Alice", text: "This is *four* comment"}
];

const CommentContainer = () => (
  <div className="comment-list">
    <h2>List</h2>
    {comments.map((comment, index) => {
      return (
        <li className="list-group-item" key={comment.id}>
          <Comment id={comment.id} author={comment.author} text={comment.text} />
        </li>
      )
    })}
    <CommentForm />
  </div>
);

export default CommentContainer;
