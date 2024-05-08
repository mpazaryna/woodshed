require 'spec_helper'

describe "devices/show.html.erb" do
  before(:each) do
    @device = assign(:device, stub_model(Device,
      :ip => "Ip",
      :hw_manufacturer => "Hw Manufacturer"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Ip/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Hw Manufacturer/)
  end
end
