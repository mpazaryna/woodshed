class WelcomeController < ApplicationController
  def index
    AppLog.logit :m => "WelcomeController#index"
  end
end
