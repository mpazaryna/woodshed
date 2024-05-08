import React from 'react';
import Say from '../src/components/say';
import { storiesOf } from '@kadira/storybook';

storiesOf('Say', module)
  .add('component1', () => (
    <Say word="should-be-italics" />
  ))
  .add('component2', () => (
    <Say word="italics" />
  ));
