require_relative 'api.rb'
require 'nokogiri'
 
# CRUD example with an api
 
def list_people(api_object)
  doc = Nokogiri::XML.parse api_object.read
  names = doc.xpath('people').collect {|e| e.text }
  puts names.join(", ")
  puts ""
end

api = Api.new
list_people(api)