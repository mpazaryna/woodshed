require 'rubygems'
require 'bundler'
Bundler.require

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)
MongoMapper.database = "test1-#{RUBY_VERSION.gsub('.', '-')}"
MongoMapper.database.collections.each { |c| c.drop_indexes }

class Person
  include MongoMapper::Document
  key :name, String
  key :age, Integer
end

class BadPerson < Person
  key :habit, String
end


class God
  include MongoMapper::Document
  key :strengh, String
end


class ChristianGod < God
end

class ZenGod < God
end
