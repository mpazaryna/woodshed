import React from 'react';
import CommentContainer from '../src/containers/CommentContainer';
import CommentForm from '../src/components/comment/commentForm';
import CommentList from '../src/components/comment/commentList';

import { storiesOf } from '@kadira/storybook';

storiesOf('Comment', module)
  .add('form', () => (
    <CommentForm />
  ))
  .add('list', () => (
    <CommentList />
  ))
  .add('container', () => (
    <CommentContainer />
  ));
