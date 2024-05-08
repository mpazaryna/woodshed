import React from 'react';

const CommentForm = () => (
  <div className="comment-form">
    <h2>Form</h2>
    <form className="commentForm">
     <input type="text" placeholder="Your name" />
     <input type="text" placeholder="Say something..." />
     <input type="submit" value="Post" />
    </form>
  </div>
);

export default CommentForm;
