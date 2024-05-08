require 'spec_helper'

describe "audits/show.html.erb" do
  before(:each) do
    @audit = assign(:audit, stub_model(Audit,
      :controller_name => "Controller Name",
      :action_name => "Action Name",
      :duration => 1.5
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Controller Name/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Action Name/)
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/1.5/)
  end
end
