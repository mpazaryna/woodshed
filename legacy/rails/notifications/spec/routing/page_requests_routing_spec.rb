require "spec_helper"

describe PageRequestsController do
  describe "routing" do

    it "routes to #index" do
      get("/page_requests").should route_to("page_requests#index")
    end

    it "routes to #new" do
      get("/page_requests/new").should route_to("page_requests#new")
    end

    it "routes to #show" do
      get("/page_requests/1").should route_to("page_requests#show", :id => "1")
    end

    it "routes to #edit" do
      get("/page_requests/1/edit").should route_to("page_requests#edit", :id => "1")
    end

    it "routes to #create" do
      post("/page_requests").should route_to("page_requests#create")
    end

    it "routes to #update" do
      put("/page_requests/1").should route_to("page_requests#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/page_requests/1").should route_to("page_requests#destroy", :id => "1")
    end

  end
end
