# http://api.rubyonrails.org/classes/ActiveSupport/Notifications.html

# From the Railscasts 249
#
# An instrument takes a block of code and when the block finishes executing it will send out a notification event. 
# Any notifications that are subscribed to this event will then be triggered. A typical request in a Rails 3 
# application sends out several of these notifications and we can subscribe to any of them. 


#ActiveSupport::Notifications.subscribe do |name, start, finish, id, payload|  
#  Rails.logger.debug(["notification:", name, start, finish, id, payload].join(" "))  
#end

# notification for process_action.action_controller are inserted into a table
ActiveSupport::Notifications.subscribe "process_action.action_controller" do |name, start, finish, id, payload|  
  PageRequest.create! do |page_request|  
    page_request.path = payload[:path]  
    page_request.page_duration = (finish - start) * 1000  
    page_request.view_duration = payload[:view_runtime]  
    page_request.db_duration = payload[:db_runtime]  
  end  
end

# notification specific to the the people show are sent to the debug log
#ActiveSupport::Notifications.subscribe "people.create"  do |name, start, finish, id, payload|  
#  Rails.logger.debug "people create: #{payload[:incoming]}"  
#end 