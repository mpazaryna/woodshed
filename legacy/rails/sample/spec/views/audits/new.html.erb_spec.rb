require 'spec_helper'

describe "audits/new.html.erb" do
  before(:each) do
    assign(:audit, stub_model(Audit,
      :controller_name => "MyString",
      :action_name => "MyString",
      :duration => 1.5
    ).as_new_record)
  end

  it "renders new audit form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => audits_path, :method => "post" do
      assert_select "input#audit_controller_name", :name => "audit[controller_name]"
      assert_select "input#audit_action_name", :name => "audit[action_name]"
      assert_select "input#audit_duration", :name => "audit[duration]"
    end
  end
end
