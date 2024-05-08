import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import World from './';

describe('<World />', () => {
  let wrapper;
  let a = "world component";

  beforeEach(() => {
    wrapper = shallow(<World />)
  });

  it('wraps the component in the world class', () => {
    expect(wrapper.find('.world'))
      .to.have.length(1);
  });

  it('wraps the name prop in an H2', () => {
    expect(wrapper.find('h2').first().text())
      .to.equal(a)
  });

});
