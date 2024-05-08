import React from 'react';
import {About} from 'wisesmile-components';
import AboutContainer from '../src/containers/AboutContainer';
import { storiesOf } from '@kadira/storybook';

storiesOf('About', module)
  .add('component', () => (
    <About name="ot-react-components" version="0.1.1" />
  ))
  .add('container', () => (
    <AboutContainer />
  ));
