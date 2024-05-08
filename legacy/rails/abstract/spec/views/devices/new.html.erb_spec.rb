require 'spec_helper'

describe "devices/new.html.erb" do
  before(:each) do
    assign(:device, stub_model(Device,
      :ip => "MyString",
      :hw_manufacturer => "MyString"
    ).as_new_record)
  end

  it "renders new device form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => devices_path, :method => "post" do
      assert_select "input#device_ip", :name => "device[ip]"
      assert_select "input#device_hw_manufacturer", :name => "device[hw_manufacturer]"
    end
  end
end
