class ApplicationController < ActionController::Base
  protect_from_forgery
  
  # Places the current_action and current_controller in instance variables, required by audit_the_method
  def instantiate_controller_and_action_names
    @current_action = action_name
    @current_controller = controller_name
  end
  
  # Wrapper will insert a record into the db
  def audit_the_method
    val = Benchmark.realtime { yield }
    val = ('%.5f' % val)
    Audit.create( :controller_name => @current_controller, :action_name => @current_action, :duration => val)
  end
  
end