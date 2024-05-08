require 'spec_helper'

describe PageRequest do
  it "can be instantiated" do
    PageRequest.new.should be_an_instance_of(PageRequest)
  end

  it "can be saved successfully" do
    PageRequest.create.should be_persisted
  end
end