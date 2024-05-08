require 'spec_helper'

describe "notifications/index.html.erb" do
  before(:each) do
    assign(:notifications, [
      stub_model(Notification,
        :path => "Path",
        :page_duration => 1.5,
        :view_duration => 1.5,
        :db_duration => 1.5,
        :payload => "MyText"
      ),
      stub_model(Notification,
        :path => "Path",
        :page_duration => 1.5,
        :view_duration => 1.5,
        :db_duration => 1.5,
        :payload => "MyText"
      )
    ])
  end

  it "renders a list of notifications" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Path".to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.5.to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.5.to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => 1.5.to_s, :count => 2
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
