  # Audit is a simple way of keeping track of response times executed by the rails 
  # controller.  As designed, Audit, will store the response time in a table, which
  # makes for a quicker review of the results.
  #
  # == Migration
  #    create_table :audits do |t|
  #      t.string :controller_name
  #      t.string :action_name
  #      t.float :duration
  #      t.timestamps
  #    end
  #
  # == Controller usage example
  #    around_filter :audit_the_method
  #    before_filter :instantiate_controller_and_action_names
  
class Audit < ActiveRecord::Base
  
  # All audits
  # @return [ActiveRecord]
  def recent
    @audits = Audit.all
  end
  
end