import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import CommentForm from './commentForm';

describe('<CommentForm />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<CommentForm />)
  });

  it('wraps the component in the comment-form class', () => {
    expect(wrapper.find('.comment-form'))
      .to.have.length(1);
  });

});
