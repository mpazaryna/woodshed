require 'rubygems'
require 'bundler'
Bundler.require

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017, :logger => Logger.new('./test.log'))
MongoMapper.database = "test1-#{RUBY_VERSION.gsub('.', '-')}"
MongoMapper.database.collections.each { |c| c.drop_indexes }

class Person
  include MongoMapper::Document
  key :name, String
  key :age, Integer
  many :tags
end

class Tag
  include MongoMapper::Document
  key :label, String
  belongs_to :person
end

describe "One to many relations" do
  context 'One person with many tags' do
    before do
      p1 = Person.create(:name => 'Some guy', :age => 123)
      Tag.create(:label => 'Ugly', :person => p1)
      Tag.create(:label => 'Deadly', :person => p1)
    end
    after do
      MongoMapper.connection.drop_database MongoMapper.database.name
    end
    it 'should have two tags' do
      Person.where(:name => 'Some guy').first.tags.count.should == 2
    end
  end
end
