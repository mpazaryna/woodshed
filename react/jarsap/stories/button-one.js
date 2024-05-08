// components/stories/button.js

import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Button One', module)
  .add('with text', () => (
    <button onClick={action('clicked')}>My First Button</button>
  ))
  .add('with no text', () => (
    <button></button>
  ));
