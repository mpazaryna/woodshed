require 'rubygems'
require 'httparty'

class Rep
  include HTTParty
end

# puts Rep.get('http://whoismyrepresentative.com/whoismyrep.php?zip=21401')
puts Rep.get('http://whoismyrepresentative.com/whoismyrep.php', :query => {:zip => 21401})