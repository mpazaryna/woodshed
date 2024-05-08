require 'spec_helper'

describe "notifications/show.html.erb" do
  before(:each) do
    @notification = assign(:notification, stub_model(Notification,
      :path => "Path",
      :page_duration => 1.5,
      :view_duration => 1.5,
      :db_duration => 1.5,
      :payload => "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Path/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/1.5/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/1.5/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/1.5/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/MyText/)
  end
end
