require 'spec_helper'

describe "devices/edit.html.erb" do
  before(:each) do
    @device = assign(:device, stub_model(Device,
      :ip => "MyString",
      :hw_manufacturer => "MyString"
    ))
  end

  it "renders the edit device form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => devices_path(@device), :method => "post" do
      assert_select "input#device_ip", :name => "device[ip]"
      assert_select "input#device_hw_manufacturer", :name => "device[hw_manufacturer]"
    end
  end
end
