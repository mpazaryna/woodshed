require 'logger'

log = Logger.new(STDOUT)
log.level = Logger::DEBUG
log.datetime_format = "%H:%M:%S"
log.info("Application Info")

3.times do |i|
 log.debug("Executing loop, i = #{i}")
end

log = Logger.new('test.log')
log.debug "Log file created"
