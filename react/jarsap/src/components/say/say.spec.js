import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Say from './';

describe('<Say />', () => {
  let wrapper;
  const a = "lorem";

  beforeEach(() => {
    wrapper = shallow(<Say word={a} />)
  });

  it('wraps the component in the say class', () => {
    expect(wrapper.find('.say'))
      .to.have.length(1);
  });

  it('wraps the name prop in an H2', () => {
    expect(wrapper.find('h2').first().text())
      .to.equal(a)
  });

});
