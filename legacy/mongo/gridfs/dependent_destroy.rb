require 'rubygems'
require 'bundler'
Bundler.require

MongoMapper.connection = Mongo::Connection.new('127.0.0.1', 27017)
database = "test-#{RUBY_VERSION.gsub('.', '-')}"
MongoMapper.database = database
class Tag
  include MongoMapper::Document
  key :label, String
  belongs_to :person
end

class Person
  include MongoMapper::Document
  key :name, String
  key :age, Integer
  many :tags, :dependent => :destroy
end

describe "Dependent destroy for many and one associations" do
  after(:all) do
    MongoMapper.connection.drop_database database
  end

  before(:all) do
    @person = Person.create(:name => 'paco', :age => 15)
    tag1 = Tag.create(:label => 'small')
    tag2 = Tag.create(:label => 'crazy')
    @person.tags << tag1
    @person.tags << tag2
    @person.save
  end

  it 'should be correclty set up' do
    Person.all.count.should == 1
    Tag.all.count.should == 2
    Person.first.tags.count == 2
  end

  context "on many associations" do
    context 'when deleting a person' do
      it 'should delete all his tags' do
        person = Person.where(:name => 'paco').first
        person.destroy
        Person.all.count.should == 0
        Tag.all.count.should == 0
      end
    end
  end
end
