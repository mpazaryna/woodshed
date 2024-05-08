require 'mongo_mapper'
require_relative 'test_helper'
require './lib/foo'
require 'logger' 

MongoMapper.database = 'tmp'

class FooTest < MiniTest::Test
      
  log = Logger.new('./log/log.txt')
    
  context 'mongo_mapper' do 
                
  should 'count records' do
    f = Foo.count
    assert_equal 16, f    
  end
   
  should 'walk the collection' do
    log.debug "variation 1"         
    foos = Foo.where(:name => "foo")
    foos.find_each do |document| 
      log.debug "found #{document.name}"     
    end      
  end
             
 end      
end