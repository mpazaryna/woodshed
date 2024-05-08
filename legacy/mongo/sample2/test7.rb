require 'rubygems'
require 'bundler'
Bundler.require

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)
MongoMapper.database = "test1-#{RUBY_VERSION.gsub('.', '-')}"
MongoMapper.database.collections.each { |c| c.drop_indexes }

class Person
  include MongoMapper::Document
  key :name, String
end

describe "A collection of people" do
  context 'Some have the same name' do
    before do
      bp1 = Person.create(:name => 'Matt', :ssn => "123A")
      bp1.save
      bp2 = Person.create(:name => 'Brent', :ssn => "123B")
      bp2.save
      bp3 = Person.create(:name => 'Brent', :ssn => "123C")
      bp3.save
      bp4 = Person.create(:name => 'Brent', :ssn => "123D")
      bp4.save
    end
    after do
      MongoMapper.connection.drop_database MongoMapper.database.name
    end
    it 'should have 4 records' do
      c = Person.all.count
      c.should == 4
    end
    it 'when distinct, it should have 2 records' do
      c = Person.collection.distinct("name").count
      c.should == 2
    end
    it 'when distinct and selecting a name' do
      n = 'Brent'
      dat = Person.collection.distinct("name",{name: n}).count
      dat.should == 1
    end
  end
end