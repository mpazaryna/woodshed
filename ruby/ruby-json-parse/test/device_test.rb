require_relative 'test_helper'
require 'json'
require './lib/parse-device'

class DeviceTest < MiniTest::Test      
  context 'parsing json data' do  
     should 'return device subscriptions' do
       r = ParseDevice.new    
       r.device_json    
     end           
  end        
end