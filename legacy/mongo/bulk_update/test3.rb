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
end

describe "Entire suite" do
  context 'Three persons' do
    before do
      p1 = Person.create(:name => 'A', :age => 23, :company_guid => "ABC")
      p2 = Person.create(:name => 'B', :age => 24, :company_guid => "ABC")
      p3 = Person.create(:name => 'C', :age => 25, :company_guid => "DEF")
    end
    after do
      MongoMapper.connection.drop_database MongoMapper.database.name
    end
    it 'should have three people' do
      Person.count.should == 3
    end
    it 'should have 2 people with the company_guid "ABC"' do
      Person.where(company_guid: 'ABC').count.should == 2
    end
    it 'should add the attribute "parent_guid" to the people with company_guid "ABC"' do
      Person.set({:company_guid => 'ABC'}, :parent_guid => '123456')
      Person.where(parent_guid: '123456').count.should == 2
    end
  end
end