require 'rubygems'
require 'bundler'
Bundler.require

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)
MongoMapper.database = "test1-#{RUBY_VERSION.gsub('.', '-')}"
MongoMapper.database.collections.each { |c| c.drop_indexes }

class Person
  include MongoMapper::Document
  set_collection_name :moronga
  puts collection_name
  key :name, String
end

