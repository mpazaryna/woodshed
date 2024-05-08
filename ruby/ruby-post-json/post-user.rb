#!/usr/bin/env ruby
 
require 'base64'
require 'json'
require 'rest_client'
 
# Set the request parameters
host = 'http://costume-pepper.codio.io:1337'
user = 'admin'
pwd = 'admin'
 
request_body_map = {
  :user_name => 'ruby',
  :first_name => 'Ruby',
  :last_name => 'Client',
  :email => 'rclient2@example.com',
  :password => '123'    
}
 
begin
  response = RestClient.post("#{host}/user",
                        request_body_map.to_json,    # Encode the entire body as JSON
                        {:authorization => "Basic #{Base64.strict_encode64("#{user}:#{pwd}")}",
                         :content_type => 'application/json',
                         :accept => 'application/json'})
  
  puts "#{response.to_str}"
  puts "Response status: #{response.code}"
  
  response.headers.each { |k,v|
    puts "Header: #{k}=#{v}"
  }

rescue => e
  puts "ERROR: #{e}"
end
