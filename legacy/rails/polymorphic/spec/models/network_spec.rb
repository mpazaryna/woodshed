require 'spec_helper'

describe Network do
  it "can be instantiated" do
    Network.new.should be_an_instance_of(Network)
  end

  it "can be saved successfully" do
    Network.create.should be_persisted
  end
end