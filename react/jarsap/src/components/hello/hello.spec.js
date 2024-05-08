import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Hello from './';

describe('<Hello />', () => {
  let wrapper;
  let a = "lorem";

  beforeEach(() => {
    wrapper = shallow(<Hello value={a} />)
  });

  it('wraps the component in the hello class', () => {
    expect(wrapper.find('.hello'))
      .to.have.length(1);
  });

  it('wraps the name prop in an H2', () => {
    expect(wrapper.find('h2').first().text())
      .to.equal(a)
  });

  it('wraps the name prop in an H2 - just to force a travis build.', () => {
    expect(wrapper.find('h2').first().text())
      .to.equal(a)
  });

});
