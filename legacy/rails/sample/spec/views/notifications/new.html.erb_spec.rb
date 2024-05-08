require 'spec_helper'

describe "notifications/new.html.erb" do
  before(:each) do
    assign(:notification, stub_model(Notification,
      :path => "MyString",
      :page_duration => 1.5,
      :view_duration => 1.5,
      :db_duration => 1.5,
      :payload => "MyText"
    ).as_new_record)
  end

  it "renders new notification form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => notifications_path, :method => "post" do
      assert_select "input#notification_path", :name => "notification[path]"
      assert_select "input#notification_page_duration", :name => "notification[page_duration]"
      assert_select "input#notification_view_duration", :name => "notification[view_duration]"
      assert_select "input#notification_db_duration", :name => "notification[db_duration]"
      assert_select "textarea#notification_payload", :name => "notification[payload]"
    end
  end
end
