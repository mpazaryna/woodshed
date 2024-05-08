require 'spec_helper'

describe "devices/index.html.erb" do
  before(:each) do
    assign(:devices, [
      stub_model(Device,
        :ip => "Ip",
        :hw_manufacturer => "Hw Manufacturer"
      ),
      stub_model(Device,
        :ip => "Ip",
        :hw_manufacturer => "Hw Manufacturer"
      )
    ])
  end

  it "renders a list of devices" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Ip".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Hw Manufacturer".to_s, :count => 2
  end
end
