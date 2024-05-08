require 'spec_helper'

describe "audits/index.html.erb" do
  before(:each) do
    assign(:audits, [
      stub_model(Audit,
        :controller_name => "Controller Name",
        :action_name => "Action Name",
        :duration => 1.5
      ),
      stub_model(Audit,
        :controller_name => "Controller Name",
        :action_name => "Action Name",
        :duration => 1.5
      )
    ])
  end

  it "renders a list of audits" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Controller Name".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Action Name".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.5.to_s, :count => 2
  end
end
