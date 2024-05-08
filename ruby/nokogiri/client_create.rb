require_relative 'api.rb'
require 'nokogiri'

# CRUD example with an api
 
api = Api.new
puts "Creating someone..."
api.create "Bobby R. Flay", "44"