import React from 'react';
import {shallow} from 'enzyme';
import Button from './Button';

it('Button contains the text', () => {
  // Render a checkbox with label in the document
  const about = shallow(
    <Button>Hello, world</Button>
  );
  expect(about.text()).toEqual('Hello, world');
});
