# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Notifications::Application.initialize!

APPLICATIONLOG = File.open("#{Rails.root}/log/application_log.txt", 'a')
ApplicationLog = ActiveSupport::BufferedLogger.new(APPLICATIONLOG)

APPLICATIONLOG2 = File.open("#{Rails.root}/log/paz_log.txt", 'a')
ApplicationLog2 = ActiveSupport::BufferedLogger.new(APPLICATIONLOG2)