require 'spec_helper'

describe Ass do
  it "can be instantiated" do
  	a = FactoryGirl.create(:ass)
    a.should be_an_instance_of(Ass)
  end
end