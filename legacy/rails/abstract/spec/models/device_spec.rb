require 'spec_helper'

describe Device do
  it "can be instantiated" do
  	d = FactoryGirl.create(:device)
    d.should be_an_instance_of(Device)
  end

  #it "can be saved successfully" do
  #  Device.create.should be_persisted
  #end
end
