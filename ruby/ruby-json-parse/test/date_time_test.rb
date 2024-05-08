require_relative 'test_helper'
require 'json'
require './lib/date-time'
require './lib/regex-json'

class DateTimeTest < MiniTest::Test      

  context 'a date time' do  
    should 'return now as UTC' do
      r = DateTime.new    
      puts "The UTC time is #{r.utc}"
    end           
  end        
      
  context 'a date time' do  
    should 'return 24 when the value is 24:00' do
      t = "24:00"    
      rj = RegexJson.new 
      x = rj.get_value(t)    
      assert_equal x, "24"    
    end      
    should 'return 17 when the value is 17:22:22' do
      t = "17:19"    
      rj = RegexJson.new 
      x = rj.get_value(t)    
      assert_equal x, "17"    
    end      
  end        
end