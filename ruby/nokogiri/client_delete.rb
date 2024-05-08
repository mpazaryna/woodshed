require_relative 'api.rb'
require 'nokogiri'
 
puts "deleting last record ..."
api = Api.new
# Read all and get valid IDs
doc = Nokogiri::XML.parse api.read
ids = doc.xpath('people/id').collect {|e| e.text }
api.delete ids.last

