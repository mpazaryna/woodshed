import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Help from './help';

describe('Help suite', function () {
  it('should render an `.help component`', () => {
    const wrapper = shallow(<Help />);
    expect(wrapper.find('.help')).to.have.length(1);
  });
});
