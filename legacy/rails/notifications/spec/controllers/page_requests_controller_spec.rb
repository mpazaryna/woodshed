require 'spec_helper'

# since this is being updated by notifications, there should be no need to implement
# new, edit, create, update or destroy methods

describe PageRequestsController do

  # This should return the minimal set of attributes required to create a valid
  # PageRequest. As you add validations to PageRequest, be sure to
  # update the return value of this method accordingly.
  def valid_attributes
    {}
  end

  describe "GET index" do
    it "assigns all page_requests as @page_requests" do
      page_request = PageRequest.create! valid_attributes
      get :index
      assigns(:page_requests).should eq([page_request])
    end
  end

  describe "GET show" do
    it "assigns the requested page_request as @page_request" do
      page_request = PageRequest.create! valid_attributes
      get :show, :id => page_request.id
      assigns(:page_request).should eq(page_request)
    end
  end

end
