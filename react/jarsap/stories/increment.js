import React from 'react';
import Increment from '../src/components/like';
import IncrementContainer from '../src/containers/IncrementContainer';

import { storiesOf } from '@kadira/storybook';

storiesOf('Increment', module)
  .add('component1', () => (
    <Increment />
  ))
  .add('component2', () => (
    <IncrementContainer />
  ));
