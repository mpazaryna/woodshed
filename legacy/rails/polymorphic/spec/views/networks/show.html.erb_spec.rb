require 'spec_helper'

describe "networks/show.html.erb" do
  before(:each) do
    @network = assign(:network, stub_model(Network,
      :logical_name => "Logical Name",
      :ip_inteface => "Ip Inteface"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Logical Name/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Ip Inteface/)
  end
end
