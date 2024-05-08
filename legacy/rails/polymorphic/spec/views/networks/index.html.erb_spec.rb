require 'spec_helper'

describe "networks/index.html.erb" do
  before(:each) do
    assign(:networks, [
      stub_model(Network,
        :logical_name => "Logical Name",
        :ip_inteface => "Ip Inteface"
      ),
      stub_model(Network,
        :logical_name => "Logical Name",
        :ip_inteface => "Ip Inteface"
      )
    ])
  end

  it "renders a list of networks" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Logical Name".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Ip Inteface".to_s, :count => 2
  end
end
