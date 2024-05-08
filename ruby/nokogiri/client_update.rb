require_relative 'api.rb'
require 'nokogiri'

# CRUD example with an api
 
def list_people(api_object)
  puts "Current Users:"
  doc = Nokogiri::XML.parse api_object.read
  names = doc.xpath('people').collect {|e| e.text }
  puts names.join(", ")
  puts ""
end
 
api = Api.new
 
# Read all and get valid IDs
doc = Nokogiri::XML.parse api.read
ids = doc.xpath('people/id').collect {|e| e.text }
 
# Update last record
puts "Updating last record ..."
api.update ids.last, "Steven R. Flay", "64"
list_people(api)
