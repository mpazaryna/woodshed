require "spec_helper"

describe NetworksController do
  describe "routing" do

    it "routes to #index" do
      get("/networks").should route_to("networks#index")
    end

    it "routes to #new" do
      get("/networks/new").should route_to("networks#new")
    end

    it "routes to #show" do
      get("/networks/1").should route_to("networks#show", :id => "1")
    end

    it "routes to #edit" do
      get("/networks/1/edit").should route_to("networks#edit", :id => "1")
    end

    it "routes to #create" do
      post("/networks").should route_to("networks#create")
    end

    it "routes to #update" do
      put("/networks/1").should route_to("networks#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/networks/1").should route_to("networks#destroy", :id => "1")
    end

  end
end
