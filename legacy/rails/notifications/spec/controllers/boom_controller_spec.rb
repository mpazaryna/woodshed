require 'spec_helper'

describe BoomController do

  describe "GET 'index'" do
    it "returns http success" do
      get 'index'
      response.should be_success
    end
  end

  describe "GET 'boom'" do
    it "returns http success" do
      get 'boom'
      response.should be_success
    end
  end

end
