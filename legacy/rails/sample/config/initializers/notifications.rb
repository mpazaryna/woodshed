ActiveSupport::Notifications.subscribe do |name, start, finish, id, payload|
  # Rails.logger.debug(["notification: ", name,start,finish,id,payload].join(" "))
  
  Notification.create! do |req|
    req.path = payload[:path]
    req.page_duration = (finish - start) * 1000
    req.view_duration = payload[:view_runtime]
  end
  
  
end
