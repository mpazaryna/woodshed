import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import App from '../App';
import '../index.css';

storiesOf('App', module)
  .add('default view', () => (
    <App />
  ));
