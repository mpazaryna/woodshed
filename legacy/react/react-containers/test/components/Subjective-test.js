import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import Subjective from '../../src/components/Subjective';

describe("Subjective suite", function() {

  it('should render an `.subjective component`', () => {
    const wrapper = shallow(<Subjective name="test" age="15" />);
    expect(wrapper.find('.subjective')).to.have.length(1);
  });

});
