require 'spec_helper'

describe "page_requests/index.html.erb" do
  before(:each) do
    assign(:page_requests, [
      stub_model(PageRequest,
        :path => "Path",
        :page_duration => 1.5,
        :view_duration => 1.5,
        :db_duration => 1.5
      ),
      stub_model(PageRequest,
        :path => "Path",
        :page_duration => 1.5,
        :view_duration => 1.5,
        :db_duration => 1.5
      )
    ])
  end

  it "renders a list of page_requests" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Path".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.5.to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.5.to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.5.to_s, :count => 2
  end
end
