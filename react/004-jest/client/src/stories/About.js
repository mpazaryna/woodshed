import React from 'react';
import About from '../about/about';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('About', module)
  .add('<About />', () => (
    <About name="About Component" />
  ));
