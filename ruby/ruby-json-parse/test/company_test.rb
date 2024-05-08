require_relative 'test_helper'
require 'json'
require './lib/parse-company'

class CompanyTest < MiniTest::Test      
  context 'a json data dump report' do  
     should 'return device availability message' do
       r = ParseCompany.new    
       r.device_json    
     end           
  end        
end
