require 'spec_helper'

describe "page_requests/show.html.erb" do
  before(:each) do
    @page_request = assign(:page_request, stub_model(PageRequest,
      :path => "Path",
      :page_duration => 1.5,
      :view_duration => 1.5,
      :db_duration => 1.5
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
  end
end
