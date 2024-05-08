class ApplicationController < ActionController::Base
  protect_from_forgery

  private

   def current_user
    # sungard financials company_guid & admin user_guid
    session[:user] ||=User.where(email: 'user@example.com').first
  end

end
