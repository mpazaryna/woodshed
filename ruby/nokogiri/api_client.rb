require_relative 'api.rb'
require 'nokogiri'
 
# CRUD example with an api
 
def list_users(api_object)
  puts "Current Users:"
  doc = Nokogiri::XML.parse api_object.read
  names = doc.xpath('users').collect {|e| e.text }
  puts names.join(", ")
  puts ""
end
 
api = Api.new
list_users(api)
 
# Create
# puts "Creating someone..."
# api.create "Bobby R. Flay", "bobby@gmail.com"
# list_users(api)
 
# Read one and do nothing with it
# api.read 1
 
# Read all and get valid IDs
doc = Nokogiri::XML.parse api.read
ids = doc.xpath('users/id').collect {|e| e.text }
 
# Update last record
# puts "Updating last record ..."
# api.update ids.last, "Robert Flaid", "robert@gmail.com"
# list_users(api)
 
# Delete
# puts "deleting last record ..."
# api.delete ids.last
# list_users(api)
