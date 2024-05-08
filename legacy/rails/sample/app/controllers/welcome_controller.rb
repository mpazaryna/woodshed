class WelcomeController < ApplicationController
  around_filter :audit_the_method
  before_filter :instantiate_controller_and_action_names

  def index
    logger.info '### informational message'
  end
end
