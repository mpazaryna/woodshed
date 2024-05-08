import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Patient from '../../src/components/Patient';

describe("Patient suite", function() {

  it('should render an `.patient component`', () => {
    const wrapper = shallow(<Patient name="test" age="15" />);
    expect(wrapper.find('.patient')).to.have.length(1);
  });

});
