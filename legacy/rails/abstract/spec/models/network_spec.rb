require 'spec_helper'

describe Network do

  it "can be instantiated" do
  	n = FactoryGirl.create(:network)
    n.should be_an_instance_of(Network)
  end

end