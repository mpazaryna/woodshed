require 'spec_helper'

describe "networks/edit.html.erb" do
  before(:each) do
    @network = assign(:network, stub_model(Network,
      :logical_name => "MyString",
      :ip_inteface => "MyString"
    ))
  end

  it "renders the edit network form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => networks_path(@network), :method => "post" do
      assert_select "input#network_logical_name", :name => "network[logical_name]"
      assert_select "input#network_ip_inteface", :name => "network[ip_inteface]"
    end
  end
end
