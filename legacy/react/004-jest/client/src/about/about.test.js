import React from 'react';
import {shallow} from 'enzyme';
import About from './about';

it('About contains the text', () => {
  // Render a checkbox with label in the document
  const about = shallow(
    <About name="hello"/>
  );
  expect(about.text()).toEqual('hello');
});
