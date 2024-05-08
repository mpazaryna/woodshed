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
  many :tags

  def tags
    Tag.where(:person_id => self.id).all
  end
end

class BadPerson < Person
  key :killed, Integer
end

class GoodPerson < Person
  key :saved, Integer
end

class Tag
  include MongoMapper::Document
  key :label, String
  belongs_to :person
end

describe "One to many relations" do
  context 'One person with many tags' do
    before do
      bp1 = BadPerson.create(:name => 'Some guy', :age => 123, :killed => 123)
      Tag.create(:label => 'Ugly', :person => bp1)
      Tag.create(:label => 'Deadly', :person => bp1)

      bp2 = GoodPerson.create(:name => 'Other guy', :age => 45, :killed => 0)
      Tag.create(:label => 'Nice', :person => bp2)
      Tag.create(:label => 'Benevolent', :person => bp2)
    end
    after do
      MongoMapper.connection.drop_database MongoMapper.database.name
    end
    it 'bad person should have two tags' do
      BadPerson.where(:name => 'Some guy').first.tags.count.should == 2
    end
    it 'good person should have two tags' do
      GoodPerson.where(:name => 'Other guy').first.tags.count.should == 2
    end
    it 'person should have four tags' do
      Person.all.each do |person|
        person.tags.count.should == 2
      end
    end
  end
end
